const pool = require('../models/data');

exports.getDelete = (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM public.datatypes WHERE id = ${id}`;

  pool.query(sql, err => {
    if (err) console.log(err);

    res.redirect('/');
  });
};
