const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
/* const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
}); */

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    dialect: "postgres",
    host: "localhost",
    port: 5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.idassists = require("./idAssist.model.js")(sequelize, Sequelize);
module.exports = db;
