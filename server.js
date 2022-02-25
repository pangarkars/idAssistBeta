const express = require("express");
const path = require("path");
const app = express();
const axios = require("axios");

let SECRET_KEY = "";

app.use(express.static(__dirname + "/dist/id-assist"));

/* app.get("/backend", (req, res) => {
  res.json({ url: process.env.BACKEND_URL });
}); */

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/id-assist/index.html"));
});

/**
 * API options used for axios
 */
var options = {
  method: "GET",
  url: "https://api.heroku.com/apps/idassistbeta1/config-vars",
  headers: {
    "api-key": process.env.OPENAI_SECRET_KEY,
  },
};

/**
 * API call
 * This url will be used in the angular app to request the api call
 * but the actual api call will made here in the server and the response will be sent back to angular app
 */
app.get("/getKey", (req, res) => {
  axios(options)
    .then((dataResponse) => {
      //API response
      res.json({ data: dataResponse.data });
    })
    .catch((err) => {
      //error handler
      next(err);
      console.log(err);
    });
});

app.listen(process.env.PORT || 8080);
