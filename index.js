const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
const chatGPTRoutes = require("./Routes/chatGPT");

app.use("/chatGPT", chatGPTRoutes);
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send("an error occured");
});
//---------------------------------------

app.listen(3000, () => {
  console.log("server started");
});
