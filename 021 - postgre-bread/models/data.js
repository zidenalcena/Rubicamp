const { Pool, Client } = require('pg');

const connectionString =
  'postgresql://postgres:12345@localhost/bread.db';

const pool = new Pool({
  connectionString: connectionString
});

module.exports = pool;
