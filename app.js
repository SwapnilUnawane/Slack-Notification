const express = require('express');
const mysql = require('mysql2/promise');
const cron = require('node-cron');
const { fetchVulnerabilities } = require('./services/nvdservice');
const { notifyAdmin } = require('./services/slackservice');
const Vulnerability = require('./models/vulnerability');
const config = require('./config/config.json');

const app = express();

// Initialize MySQL database
const initDb = async () => {
  const db = await mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  });
  await Vulnerability.createTable();
};

initDb();

// Scheduled task to fetch vulnerabilities
cron.schedule(config.fetchInterval, async () => {
  await fetchVulnerabilities();

  const newVulns = await Vulnerability.fetchNewVulnerabilities();
  for (const vuln of newVulns) {
    await notifyAdmin(vuln);
    await Vulnerability.markAsNotified(vuln.id);
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
