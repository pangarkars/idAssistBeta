module.exports = (sequelize, Sequelize) => {
  const IdAssist = sequelize.define("idassists", {
    prompt: {
      type: Sequelize.STRING,
    },
    input: {
      type: Sequelize.STRING,
    },
    output: {
      type: Sequelize.STRING,
    },
    createdAt: {
      type: Sequelize.DATE,
      field: "created_at",
    },

    updatedAt: {
      type: Sequelize.DATE,
      field: "updated_at",
    },
  });
  return IdAssist;
};
