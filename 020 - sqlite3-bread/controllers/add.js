const db = require('../models/data');

exports.getAdd = (req, res) => {
  res.render('add');
};

exports.postAdd = (req, res) => {
  const str = req.body.string || 'kosong';
  const int = req.body.integer || 'kosong';
  const flo = req.body.float || 'kosong';
  const dte = req.body.date || 'kosong';
  let bol = req.body.boolean;
  let displayDate;

  if (dte !== 'kosong') {
    const splittedDate = dte.split('-');
    const month = convertMonth(splittedDate[1]);
    const newDate = `${splittedDate[2]} ${month} ${splittedDate[0]}`;
    displayDate = newDate;
  } else {
    displayDate = 'kosong';
  }

  const data = [str, int, flo, dte, bol, displayDate];

  const sql = `INSERT INTO 
    datatypes ( string, integer, float, date, boolean, displayDate ) 
    VALUES ( ?, ?, ?, ?, ?, ? )`;

  db.run(sql, data, err => {
    if (err) console.log(err);

    res.redirect('/');
  });
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
