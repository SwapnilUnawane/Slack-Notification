const axios = require('axios');
const Vulnerability = require('../models/vulnerability');

const fetchVulnerabilities = async () => {
  try {
    // const response = await axios.get('http://lists.fedoraproject.org/pipermail/package-announce/2021-April/077635.html');
    const response = await axios.get('https://services.nvd.nist.gov/rest/json/cves/1.0');
    console.log('response',response.data);
    const vulnerabilities = response.data.result.CVE_Items;

    console.log('response',response);
    for (const vuln of vulnerabilities) {
      await Vulnerability.insertVulnerability({
        id: vuln.cve.CVE_data_meta.ID,
        description: vuln.cve.description.description_data[0].value,
        severity: vuln.severity,
        datePublished: new Date(vuln.publishedDate),
      });
    }
  } catch (error) {
    console.error('Error fetching vulnerabilities:', error);
  }
};

module.exports = { fetchVulnerabilities };
