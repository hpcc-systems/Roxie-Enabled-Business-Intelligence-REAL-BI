const path = require('path');

// Load .env file
require('dotenv').config({ path: path.join(process.cwd(), '..', '.env') });

const { DB_NAME, DB_PORT, DIALECT, HOST, PASS, USER } = process.env;

module.exports = {
  username: USER,
  password: PASS,
  database: DB_NAME,
  host: HOST,
  port: DB_PORT,
  dialect: DIALECT,
};
