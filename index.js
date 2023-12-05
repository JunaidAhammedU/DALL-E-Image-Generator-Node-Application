const express = require("express");
const app = express();
const chatGPTRoutes = require("./Routes/chatGPT");
require("dotenv").config();

app.use("/chatGPT", chatGPTRoutes);
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send("an error occured");
});
//---------------------------------------

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
