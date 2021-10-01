const db = require('../models/data');

exports.getIndex = (req, res) => {
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

  const filter = [];
  const field = [];

  if (idChecked && idFiltered)
    if (Number(idFiltered)) {
      filter.push(Number(idFiltered));
      field.push('id');
    }
  if (stringChecked && stringFiltered) {
    filter.push(stringFiltered);
    field.push('string');
  }
  if (integerChecked && integerFiltered)
    if (parseInt(integerFiltered)) {
      filter.push(parseInt(integerFiltered));
      field.push('integer');
    }
  if (floatChecked && floatFiltered)
    if (parseFloat(floatFiltered)) {
      filter.push(parseFloat(floatFiltered));
      field.push('float');
    }
  if (dateChecked && startDateFiltered) {
    filter.push(startDateFiltered);
    field.push('date');
  }
  if (dateChecked && endDateFiltered) {
    filter.push(endDateFiltered);
    field.push('enddate');
  }
  if (booleanChecked && booleanFiltered) {
    filter.push(booleanFiltered);
    field.push('boolean');
  }
  
  let sql = `SELECT count(*) FROM datatypes`;
  
  if (filter.length > 0) {
    sql += ` WHERE`;
    for (let i = 0; i < field.length; i++) {
      if (field[i] === 'date') sql += ` ${field[i]} >= ?`;
      else if (field[i] === 'enddate') sql += ` date <= ?`;
      else sql += ` ${field[i]} = ?`;
      
      if (i !== field.length - 1) sql += ` AND`;
    }
  }

  const page = Number(req.params.page) || 1;
  const perPage = 3;
  const queries = req.query;
  
  db.all(sql, filter, (err, count) => {
    const total = count[0]['count(*)'];
    const pages = Math.ceil(total / perPage);
    const offset = (page - 1) * perPage;

    sql = `SELECT * FROM datatypes`;

    if (filter.length > 0) {
      sql += ` WHERE`;
      for (let i = 0; i < field.length; i++) {
        if (field[i] === 'date') sql += ` ${field[i]} >= ?`;
        else if (field[i] === 'enddate') sql += ` date <= ?`;
        else sql += ` ${field[i]} = ?`;

        if (i !== field.length - 1) sql += ` AND`;
      }
    }

    sql += ` LIMIT ${perPage} OFFSET ${offset}`;
    
    db.all(sql, filter, (err, rows) => {
      if (err) console.log(err);

      res.render('index', {
        data: rows,
        query: queries,
        current: page,
        pages: pages
      });
    });
  });
};
