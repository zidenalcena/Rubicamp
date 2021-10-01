const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'rubicamp';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });

let _db;

// Use connect method to connect to the Server
const mongoConnect = callback => {
  client.connect(function(err) {
    assert.equal(null, err);
    console.log('Connected successfully to server');

    _db = client.db(dbName);
    callback();
  });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
