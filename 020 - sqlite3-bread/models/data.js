const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('bread.db', err => {
  if (err) console.error(err.message);

  console.log('Connected to sqlite3 bread.db');
});

module.exports = db;
