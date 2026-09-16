const { PubSub } = require('@google-cloud/pubsub');
const dotenv = require('dotenv');
dotenv.config();

const pubsub = new PubSub({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCP_PROJECT_ID
});

module.exports = pubsub;
