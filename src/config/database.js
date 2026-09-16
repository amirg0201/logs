const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

async function getDatabase() {
  // Mongoose maneja internamente el pool de conexiones
  await mongoose.connect(uri, {
    dbName: dbName
  });
  console.log('✅ Conectado a MongoDB vía Mongoose');
  return mongoose.connection;
}

module.exports = {
  getDatabase
};
