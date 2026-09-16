const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  module: { type: String, required: true },
  action: { type: String, required: true },
  actor: {
    user_id: String,
    profile: String,
    school_id: String
  },
  target: {
    entity_id: String,
    entity_name: String
  },
  request_origin: {
    ip: String,
    city: String,
    country: String
  },
  technical_data: {
    log_id_gcp: { type: String, unique: true, sparse: true }
  }
}, {
  // La colección se define dinámicamente al crear el modelo
  strict: false
});

// Cache para almacenar los modelos dinámicos y no recrearlos
const models = {};

function getLogModel(moduleName) {
  // Convertir "Students" a "students_logs", "Parents" a "parents_logs"
  const safeName = (moduleName || 'unknown').toLowerCase();
  const collectionName = `${safeName}_logs`;
  const modelName = `Log_${safeName}`;

  // Si no existe el modelo en caché, lo creamos
  if (!models[modelName]) {
    models[modelName] = mongoose.model(modelName, activityLogSchema, collectionName);
  }
  
  return models[modelName];
}

module.exports = {
  getLogModel
};
