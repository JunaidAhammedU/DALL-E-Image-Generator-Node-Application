const express = require("express");
const {
  isValidRequest,
  addMessageToCoversation,
  createMessage,
  postChatGPTMessage,
} = require("../Utils/chatGPTutils");
const { USER_TYPES } = require("../contants/chatGPTRoles");

const routes = express.Router();

routes.post("/", async (req, res) => {
  if (!req.body || !req.body.context || !req.body.message) {
    return res
      .status(400)
      .send({
        message: "Invalid request: 'context' and 'message' are required",
      });
  }
  if (!isValidRequest(req.body)) {
    return res.status(400).send({ message: "invalid request" });
  }
  //-----------
  const { context, message, conversation = [] } = req.body;
  //-----------
  const contextMessage = createMessage(context, USER_TYPES.SYSTEM);
  //-----------
  addMessageToCoversation(message, conversation, USER_TYPES.USER);
  //-----------
  console.log("Generating response for: \n", message);

  const chatGPTResponse = await postChatGPTMessage(
    contextMessage,
    conversation
  );

  if (!chatGPTResponse) {
    return res.status(500).json({ error: " Error with chatGPT" });
  }

  const { content } = chatGPTResponse;

  addMessageToCoversation(content, conversation, USER_TYPES.ASSISTANT);

  console.log("updated conversation: \n", conversation);
  return res.status(200).json({ message: conversation });
});

module.exports = routes;
