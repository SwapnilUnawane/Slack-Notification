const { WebClient } = require('@slack/web-api');
const config = require('../config/config.json');

const slackClient = new WebClient(config.slack.token);

const notifyAdmin = async (vulnerability) => {
  const message = {
    channel: config.slack.channel,
    text: `New vulnerability found: ${vulnerability.description}`,
    attachments: [
      {
        text: "Select team members to notify:",
        actions: [
          {
            name: "forward",
            text: "Forward",
            type: "button",
            value: "forward"
          }
        ]
      }
    ]
  };

  await slackClient.chat.postMessage(message);
};

module.exports = { notifyAdmin };
