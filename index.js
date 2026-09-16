const { startWorker } = require('./src/services/workerService');
const dotenv = require('dotenv');

// Iniciar la aplicación
console.log('Iniciando la aplicación...');
startWorker();
