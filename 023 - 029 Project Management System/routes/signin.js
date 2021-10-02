var express = require('express');
var router = express.Router();
var helpers = require('../helpers/util')

module.exports = (db) => {

  /* =========================== LOGIN =========================== */
  router.get('/', helpers.isLoggedIn, function (req, res, next) {
    res.render('login', {
      title: 'Login',
      loginMessage: req.flash('LoginMessage'),
      isAdmin:req.session.user
    });
  });

  router.get('/login', function (req, res, next) {
    res.render('login', {
      title: 'Login',
      user: req.session.user,
      isAdmin: req.session.user,
      loginMessage: req.flash('loginMessage')
    })
  })

  router.post('/login', (req, res) => {
    // console.log(req.body)
    db.query(`SELECT * FROM users WHERE email = '${req.body.email}' AND password = '${req.body.password}'`, (err, data) => {
      // console.log(data)

      if (data.rows.length > 0) {
        req.session.user = data.rows[0];

        res.redirect('/projects/list');

      } else {
        req.flash('loginMessage', 'email atau password anda salah')
        res.redirect('/')
      }

    });
  });

  router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
      // cannot access session here
      res.redirect('/login')
    })
  })

  return router;

};