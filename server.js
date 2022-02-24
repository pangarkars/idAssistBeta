const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(__dirname + "/dist/id-assist"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/id-assist/index.html"));
});
app.get("/backend", (req, res) => {
  res.json({ url: process.env.OPENAI_SECRET_KEY });
  console.log("rerer" + res.json);
});
app.listen(process.env.PORT || 8080);
