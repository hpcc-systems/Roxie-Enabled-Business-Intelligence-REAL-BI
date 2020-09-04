const path = require('path');

// Load .env file
require('dotenv').config({ path: path.join(process.cwd(), '..', '.env') });

const { DB_HOST, DB_NAME, DB_PASS, DB_USER } = process.env;

module.exports = {
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  host: DB_HOST,
  port: 3306,
  dialect: 'mysql',
};
