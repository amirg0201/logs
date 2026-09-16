const pubsub = require('../config/pubsub');
const { getDatabase } = require('../config/database');
const { transformLog } = require('../transformers/logTransformer');
const { getLogModel } = require('../models/ActivityLog');
const dotenv = require('dotenv');
dotenv.config();

async function startWorker() {
  try {
    await getDatabase();

    // Apuntar a la suscripción local
    const subscription = pubsub.subscription(process.env.PUBSUB_SUBSCRIPTION);

    console.log('🚀 Worker iniciado y escuchando eventos en tiempo real...');

    // Escuchador de eventos (Streaming Pull)
    subscription.on('message', async (message) => {
      try {
        // Decodificar el mensaje que viene desde GCP
        const rawData = JSON.parse(message.data.toString());

        const payload = rawData.jsonPayload || rawData;
        console.log('📩 Log recibido de GCP:', payload.message);

        // Transformar y limpiar la estructura usando el transformer
        const cleanLog = transformLog(rawData, message);

        // Obtener el modelo dinámico basado en el módulo (ej. "Students")
        const DynamicLogModel = getLogModel(cleanLog.module);

        // Guardar en MongoDB con Mongoose en su colección correspondiente
        await DynamicLogModel.create(cleanLog);
        console.log(`💾 Log guardado con éxito en la colección: ${DynamicLogModel.collection.name}`);

        // Confirmar a GCP que el log se procesó correctamente (ACK)
        message.ack();

      } catch (err) {
        // Si hay error (ej. Mongo caído), no hacemos ack() para que GCP reintente luego
        console.error('❌ Error procesando el mensaje:', err.message);
      }
    });

    subscription.on('error', (error) => {
      console.error('⚠️ Error en la conexión con Pub/Sub:', error);
    });

  } catch (err) {
    console.error('Error al iniciar el Worker:', err);
  }
}

module.exports = {
  startWorker
};
