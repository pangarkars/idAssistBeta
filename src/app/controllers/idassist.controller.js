const db = require("../models");
const Idassist = db.idassists;
const Op = db.Sequelize.Op;
// Create and Save a new Tutorial
exports.create = (req, res) => {
  const sessionData = {
    prompt: req.body.prompt,
    input: req.body.input,
    output: req.body.output,
  };

  Idassist.create(sessionData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error creating new record in DB",
      });
    });
};
