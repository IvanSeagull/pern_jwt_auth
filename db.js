const { DB_USER, DB_PASSWORD, DB_DATABASE_NAME, DB_HOST, DB_PORT } = require('./config');

const Pool = require('pg').Pool;

const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE_NAME,
  host: DB_HOST,
  port: DB_PORT,
});

module.exports = pool;
