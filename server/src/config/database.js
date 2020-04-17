const path = require('path');

// Load .env file
require('dotenv').config({ path: path.join(process.cwd(), '..', '.env') });

const { DB_DIALECT, DB_HOST, DB_NAME, DB_PASS, DB_USER, DB_PORT } = process.env;

module.exports = {
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
};
