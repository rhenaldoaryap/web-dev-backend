// connect to database
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  database: "blog",
  user: "root",
  password: "aldo0806",
});

module.exports = pool;
