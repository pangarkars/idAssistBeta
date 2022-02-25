const express = require("express");
const path = require("path");
const Heroku = require("heroku-client");
const heroku = new Heroku({ token: process.env.API_TOKEN });
const app = express();

let SECRET_KEY = "";

app.use(express.static(__dirname + "/dist/id-assist"));

/* heroku
  .request({
    method: "GET",
    path: "https://api.heroku.com/apps/name-of-app/config-vars",
    headers: {
      Accept: "application/vnd.heroku+json; version=3",
      Authorization: "Bearer " + process.env.API_TOKEN,
    },
    parseJSON: true,
  })
  .then((response) => {
    console.log(response, ">>>>>>heroku api...");
    SECRET_KEY = response.OPENAI_SECRET_KEY;
  }); */

app.get(
  "https://api.heroku.com/apps/name-of-app/config-vars",
  function (req, res) {
    res.json("Sample TOKEN will be shared here");
  }
);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/id-assist/index.html"));
});

app.listen(process.env.PORT || 8080);
