const mysql = require("mysql");
const dotenv = require("dotenv")

dotenv.config({path:'./.env'})

const pool = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
  });
  pool.connect((err) => {
    if (err) throw err;
    console.log("connected db");
  });

  module.exports = pool;