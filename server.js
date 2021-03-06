
const express = require("express");
const path = require("path");
const app = express();
const axios = require("axios");

let SECRET_KEY = "";

/**
 * function to redirect traffic from http to https
 */
function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get("x-forwarded-proto") !== "https") {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
}
app.use(requireHTTPS);

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
console.log("#####");
console.log(options);

/**
 * API call
 * This url will be used in the angular app to request the api call
 * but the actual api call will made here in the server and the response will be sent back to angular app
 */
app.get("/config-vars", (req, res) => {
  axios(options)
    .then((dataResponse) => {
      //API response
      res.json({ data: dataResponse.data });
      console.log("@@@@@@@@");
      console.log(dataResponse);
    })
    .catch((err) => {
      //error handler
      console.log("$$$$$## error");
      next(err);
      console.log(err);
    });
});

app.get("/backendKey", (req, res) => {
  res.json({ url: process.env.BACKEND_URL });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
