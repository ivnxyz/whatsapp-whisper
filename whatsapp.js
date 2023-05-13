// Import dependencies
const axios = require("axios");
const { WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN } = require("./config");

const graphApi = axios.create({
  baseURL: `https://graph.facebook.com/v12.0/`,
  headers: {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
  },
})

const whatsappApi = axios.create({
  baseURL: `https://graph.facebook.com/v12.0/${WHATSAPP_PHONE_NUMBER_ID}/`,
  headers: {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
  },
});

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
  },
  responseType: "arraybuffer",
  config: {
    responseType: "arraybuffer",
  },
});

// Send a whatsapp message
const sendMessage = async (text, phoneNumber, whatsappId) => {
  // Configure body
  const body = {
    messaging_product: "whatsapp",
    preview_url: false,
    to: phoneNumber,
    type: "text",
    text: {
      body: text,
    },
  };

  const whatsappResponse = await whatsappApi.post("messages", body);
  return whatsappResponse;
};

// Send video by url
const sendVideoByUrl = async (videoUrl, phoneNumber, whatsappId, caption = "") => {
  // Configure body
  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "video",
    video: {
      link: videoUrl,
      caption
    },
  };

  const whatsappResponse = await whatsappApi.post("messages", body);
  return whatsappResponse;
};

// Get media id
const getMediaUrl = async (mediaId) => {
  return (await graphApi.get(`${mediaId}`)).data.url;
}

// Get media content
const getMediaContent = async (mediaUrl) => {
  return (await axiosInstance.get(mediaUrl, { responseType: "stream" }));
};

// Export methods
module.exports = {
  sendMessage,
  sendVideoByUrl,
  getMediaUrl,
  getMediaContent
}