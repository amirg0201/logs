const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

// Tu URI local de MongoDB
const uri = process.env.MONGO_URI;
const mongoClient = new MongoClient(uri);

async function getDatabase() {
  await mongoClient.connect();
  return mongoClient.db(process.env.DB_NAME);
}

module.exports = {
  mongoClient,
  getDatabase
};
