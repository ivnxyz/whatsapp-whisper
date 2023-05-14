# WhatsApp Whisper
Odio las notas de voz, así que creé un pequeño bot que recibe notas de voz y usa el servicio de Whisper de OpenAI para transcribir el texto.

### ¿Cómo funciona?
1. El bot recibe la nota de voz mediante [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/)
2. Se transcribe la voz a texto usando la [API de Whisper de OpenAI](https://openai.com/blog/introducing-chatgpt-and-whisper-apis)
3. Se manda el texto al usuario usando la misma API de WhatsApp

### Configuración
Crea un archivo .env con las siguientes variables de entorno:
```
OPENAI_API_KEY=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```