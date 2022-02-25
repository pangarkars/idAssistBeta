const express = require("express");
const path = require("path");
const app = express();

let SECRET_KEY = "";

app.use(express.static(__dirname + "/dist/id-assist"));

app.get("/backend", (req, res) => {
  res.json({ url: process.env.BACKEND_URL });
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/id-assist/index.html"));
});

app.listen(process.env.PORT || 8080);
