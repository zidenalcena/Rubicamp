const ObjectId = require('mongodb').ObjectId;
const getDb = require('../models/data').getDb;

exports.getIndex = (req, res, next) => {
  const idChecked = req.query.idChecked;
  const stringChecked = req.query.stringChecked;
  const integerChecked = req.query.integerChecked;
  const floatChecked = req.query.floatChecked;
  const dateChecked = req.query.dateChecked;
  const booleanChecked = req.query.booleanChecked;

  const idFiltered = req.query.id;
  const stringFiltered = req.query.string;
  const integerFiltered = req.query.integer;
  const floatFiltered = req.query.float;
  const startDateFiltered = req.query.startDate;
  const endDateFiltered = req.query.endDate;
  const booleanFiltered = req.query.boolean;

  const filter = {};

  if (idChecked && idFiltered) filter._id = ObjectId(idFiltered);
  if (stringChecked && stringFiltered) filter.string = stringFiltered;
  if (integerChecked && integerFiltered) filter.integer = integerFiltered;
  if (floatChecked && floatFiltered) filter.float = floatFiltered;
  if (dateChecked && startDateFiltered) {
    filter.date = {};
    filter.date.$gte = startDateFiltered;
  }
  if (dateChecked && endDateFiltered) filter.date.$lte = endDateFiltered;

  if (booleanChecked && booleanFiltered) filter.boolean = booleanFiltered;

  const db = getDb();

  const queries = req.query;
  const perPage = 3;
  const page = Number(req.query.page) || 1;
  const url = req.url == '/' ? '/?page=1' : req.url;

  db.collection('bread')
    .find(filter)
    .skip(perPage * page - perPage)
    .limit(perPage)
    .toArray()
    .then(result => {
      db.collection('bread')
        .countDocuments()
        .then(count => {
          res.render('index', {
            title: 'mongodb-bread',
            data: result,
            query: queries,
            current: page,
            pages: Math.ceil(count / perPage),
            url
          });
        });
    })
    .catch(err => console.log(err));
};
