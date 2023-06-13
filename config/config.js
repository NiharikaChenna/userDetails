
const dotenv = require("dotenv")
dotenv.config({path:'./.env'})

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
    jwtSecret
  };
  