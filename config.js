// Importar dependencias
const dotenv = require('dotenv')

// Configurar variables de entorno
dotenv.config()

// Exportar variables de entorno
module.exports = {
  PORT: process.env.PORT || 3000,
  ENVIRONMENT: process.env.ENVIRONMENT || 'development',
  WHATSAPP_VERIFY_TOKEN: process.env.PORT,
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID
}