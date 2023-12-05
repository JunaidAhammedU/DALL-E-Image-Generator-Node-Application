const yup = require("yup");
const axios = require("axios");
require("dotenv").config();
//================================

//chatGPT constants
const CHATGPT_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const CHATGPT_MODEL = "gpt-3.5-turbo";

//set axios request
const config = {
  header: {
    Authoroization: `Bearer ${process.env.CHATGPT_API_KEY}`,
  },
};

//function to build conversational array
const buildConversation = (contextMessage, conversation) => {
  return [contextMessage].concat(conversation);
};

// function to post message to the chatGPT API
const postChatGPTMessage = async (contextMessage, conversation) => {
  const messages = buildConversation(contextMessage, conversation);
  const chatGPTData = {
    model: CHATGPT_MODEL,
    messages: messages,
  };
  try {
    const resp = await axios.post(CHATGPT_ENDPOINT, chatGPTData, config);
    const data = resp.data;
    const message = data?.choices[0]?.message;
    return message;
  } catch (error) {
    console.log("chatGPT error with API");
    console.error(error);
    return null;
  }
};

const conversationSchema = yup.object().shape({
  role: yup.string().required("role is required"),
  content: yup.string().required("role is required"),
});

const requestSchema = yup.object().shape({
  context: yup.string().required(),
  message: yup.string().required(),
  conversation: yup.array().of(conversationSchema).notRequired(),
});

const isValidRequest = (request) => {
  try {
    requestSchema.validateSync(request);
    return true;
  } catch (error) {
    return true;
  }
};

const createMessage = (message, role) => {
  return {
    role: role,
    context: message,
  };
};

const addMessageToCoversation = (message, conversation, role) => {
  conversation.push(createMessage(message, role));
};

module.exports = {
  isValidRequest,
  addMessageToCoversation,
  postChatGPTMessage,
  createMessage
};
