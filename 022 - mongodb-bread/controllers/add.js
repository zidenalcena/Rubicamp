const getDb = require('../models/data').getDb;

exports.getAdd = (req, res, next) => {
  res.render('add', { title: 'Add' });
};

exports.postAdd = (req, res, next) => {
  const string = req.body.string || 'kosong';
  const integer = req.body.integer || 0;
  const float = req.body.float || 0;
  const date = req.body.date || 'kosong';
  const boolean = req.body.boolean || 'true';
  let displayDate;

  if (date !== 'kosong') {
    const splittedDate = date.split('-');
    const month = convertMonth(splittedDate[1]);
    const newDate = `${splittedDate[2]} ${month} ${splittedDate[0]}`;
    displayDate = newDate;
  } else {
    displayDate = 'kosong';
  }

  const newData = {
    string: string,
    integer: integer,
    float: float,
    date: date,
    boolean: boolean,
    displayDate: displayDate
  };

  const db = getDb();

  db.collection('bread')
    .insertOne(newData)
    .then(result => {
      res.redirect('/');
      console.log('Inserted new data');
    })
    .catch(err => console.log(err));
};

const convertMonth = month => {
  switch (month) {
    case '01':
      month = 'January';
      break;
    case '02':
      month = 'February';
      break;
    case '03':
      month = 'Maret';
      break;
    case '04':
      month = 'April';
      break;
    case '05':
      month = 'May';
      break;
    case '06':
      month = 'June';
      break;
    case '07':
      month = 'July';
      break;
    case '08':
      month = 'August';
      break;
    case '09':
      month = 'September';
      break;
    case '10':
      month = 'October';
      break;
    case '11':
      month = 'November';
      break;
    case '12':
      month = 'Desember';
      break;
    default:
      break;
  }
  return month;
};
