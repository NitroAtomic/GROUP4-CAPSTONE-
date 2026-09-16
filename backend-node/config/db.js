// config/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'seaware',
  password: process.env.DB_PASSWORD || 'devpassword123',
  database: process.env.DB_NAME || 'awareness_platform',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
