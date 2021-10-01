const ObjectId = require('mongodb').ObjectId;
const getDb = require('../models/data').getDb;

exports.getDelete = (req, res, next) => {
  const id = req.params.id;
  const db = getDb();

  db.collection('bread')
    .deleteOne({ "_id": ObjectId(id) })
    .then(result => {
      res.redirect('/');
      console.log('Deleted some data');
    })
    .catch(err => console.log(err));
};
