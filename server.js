// Importar dependencias
const express = require('express');
const asyncify = require('express-asyncify');
const { PORT, WHATSAPP_VERIFY_TOKEN } = require('./config');
const { sendMessage, getMediaUrl, getMediaContent } = require('./whatsapp');
const fs = require('fs');
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);
const { oggToMp3 } = require('./helper');
const { createTranscription } = require('./whisper');
const { unlink } = require('node:fs/promises');

// Crear app de express
const app = asyncify(express());
app.use(express.json());

// Ruta para validar la conexión con whatsapp
app.get("/", (req, res) => {
  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Ruta para recibir un mensaje de whatsapp
app.post("/", async (req, res) => {
  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    // Manejar mensajes de audio
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0] &&
      req.body.entry[0].changes[0].value.messages[0].type === "audio"
    ) {
      // Obtener datos de la petición
      let from = req.body.entry[0].changes[0].value.messages[0].from;
      const whatsappId = req.body.entry[0].changes[0].value.contacts[0].wa_id;
      
      // Obtener media url
      const audioId = req.body.entry[0].changes[0].value.messages[0].audio.id
      const mediaUrl = await getMediaUrl(audioId)

      // Obtener contenido
      const mediaContent = await getMediaContent(mediaUrl);

      // Guardar audio temporalmente
      const extension = mediaContent.headers['content-type'].split('/')[1];
      const filePath = `${audioId}_${Date.now()}`;

      const previousPath = `./temp/${filePath}.${extension}`;
      const newPath = `./temp/${filePath}.mp3`;

      await pipeline(mediaContent.data, fs.createWriteStream(previousPath));

      // Transformar a mp3
      await oggToMp3(previousPath, newPath);

      // Extraer texto
      const transcript = await createTranscription(fs.createReadStream(newPath), "whisper-1");

      // Eliminar archivos
      await unlink(previousPath);
      await unlink(newPath);
      
      // Reenviar mensaje
      await sendMessage(
        transcript.data.text,
        from,
        whatsappId
      );
    }
    // Manejar mensajes de texto
    else if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      // Obtener datos de la petición
      let from = req.body.entry[0].changes[0].value.messages[0].from;
      const whatsappId = req.body.entry[0].changes[0].value.contacts[0].wa_id;

      // Enviar mensaje
      try {
        await sendMessage(
          "Por el momento sólo soporto audios 😔",
          from,
          whatsappId
        );
      } catch (err) {
        console.dir(err);
      }
    }

    return res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    return res.sendStatus(404);
  }
});

// Iniciar escucha
app.listen(PORT, () => {
  console.log(`🚀 Se comenzó a escuchar en el puerto ${PORT}`)
})