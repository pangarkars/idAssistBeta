module.exports = (app) => {
  const idassists = require("../controllers/idassist.controller");
  var router = require("express").Router();
  // Create a new Tutorial
  router.post("/", idassists.create);

  app.use("/api/idassists", router);
};
