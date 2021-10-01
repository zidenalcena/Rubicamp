const db = require('../models/data');

exports.getDelete = (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM datatypes WHERE id = ?`;

  db.all(sql, id, err => {
    if (err) console.log(err);

    res.redirect('/');
  });
};
