function transformLog(rawData, message) {
  // Extraer el jsonPayload que inyecta GCP
  const payload = rawData.jsonPayload || rawData;

  // Extraer módulo de la URL (ej: "/students" -> "Students")
  const url = payload.metadata?.url || '';
  let moduleName = 'Unknown';
  const urlMatch = url.match(/\/([a-zA-Z0-9_-]+)/);
  if (urlMatch) {
    moduleName = urlMatch[1].charAt(0).toUpperCase() + urlMatch[1].slice(1);
  }

  // Transformar y limpiar la estructura
  return {
    timestamp: new Date(rawData.timestamp || message.publishTime),
    module: moduleName,
    action: `${payload.metadata?.method} ${url}`, // ej "PUT /students"
    actor: {
      user_id: payload.metadata?.user,
      profile: payload.metadata?.headers?.profiletype || payload.metadata?.type, // "staff"
      school_id: payload.metadata?.school
    },
    target: {
      entity_id: payload.metadata?.body?._id,
      entity_name: payload.metadata?.body?.relational_data?.name?.show ||
        `${payload.metadata?.body?.user?.name || ''} ${payload.metadata?.body?.user?.surname || ''}`.trim()
    },
    request_origin: {
      ip: payload.metadata?.ip,
      city: payload.metadata?.headers?.['cf-ipcity'] || 'Unknown',
      country: payload.metadata?.headers?.['cf-ipcountry'] || 'Unknown'
    },
    technical_data: {
      log_id_gcp: rawData.insertId || message.id
    }
  };
}

module.exports = {
  transformLog
};
