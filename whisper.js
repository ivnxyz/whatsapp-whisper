// Importar dependencias
const { Configuration, OpenAIApi } = require("openai");
const { OPENAI_API_KEY } = require('./config');

// Configurar OpenAI
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = { createTranscription: openai.createTranscription };