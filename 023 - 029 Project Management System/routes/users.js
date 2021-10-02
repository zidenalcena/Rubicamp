var express = require('express');
var router = express.Router();
var helpers = require('../helpers/util');
var navs = 3

module.exports = (db) => {

  /* GET users listing. */
  router.get('/list', helpers.isLoggedIn, function (req, res, next) {
    const { cuser, id, cname, cemail, email, name, cposition, roles, cfulltime, fulltime } = req.query
    const url = (req.url == '/list') ? `/list?page=1` : req.url;
    const page = req.query.page || 1;
    const limit = 2;
    const offset = (page - 1) * limit;
    let temp = []

    if (cuser && id) {
      temp.push(`userid = ${id}`)
    }
    if (cemail && email) {
      temp.push(`email = '${email}'`)
    }
    if (cname && name) {
      temp.push(`CONCAT(firstname,' ', lastname) = '${name}'`)
    }
    if (cposition && roles) {
      temp.push(`roles = '${roles}'`)
    }
    if (cfulltime && fulltime) {
      temp.push(`isfulltime = ${fulltime}`)
    }

    let sql = `SELECT COUNT(*) as total FROM users`
    if (temp.length > 0) {
      sql += ` WHERE ${temp.join(" AND ")}`
    }
    console.log(sql)
    
    db.query(sql, (err, pro) => {
      let total = pro.rows[0].total
      let pages = Math.ceil(total / limit)
      sql = `SELECT * FROM users`
      if (temp.length > 0) {
        sql += ` WHERE ${temp.join(" AND ")}`
      }
      
      
      sql += ` LIMIT ${limit} OFFSET ${offset}`
      
      db.query(sql, (err, row) => {
        console.log(sql);
        if (err) { console.log("error coy", err) }
        db.query(`SELECT optionusers FROM users WHERE userid = ${req.session.user.userid}`, (err, data) => {

          res.render('users/list', {
            data: row.rows,
            option: data.rows[0].optionusers,
            user: req.session.user,
            query: req.query, navs,
            isAdmin: req.session.user, pages, page, url
          })
        })
      })
    });
  });

  router.post('/option', (req, res) => {
    let sql = `UPDATE users SET optionusers = '${JSON.stringify(req.body)}' WHERE userid = ${req.session.user.userid}`

    // console.log(sql)
    db.query(sql, (err) => {
      if (err) return err;
      res.redirect(`/users/list`)
    })
  })

  router.get('/add', helpers.isLoggedIn, function (req, res, next) {
    res.render('users/add', {
      user: req.session.user.userid, navs,
      isAdmin: req.session.user
    })
  })

  router.post('/add', helpers.isLoggedIn, function (req, res, next) {
    const { email, password, firstname, lastname, roles, isfulltime } = req.body
    let sql = `INSERT INTO users(email, password, firstname, lastname, roles, isfulltime) VALUES ('${email}', '${password}', '${firstname}', '${lastname}', '${roles}', ${isfulltime}) `

    db.query(sql, (err) => {
      if (err) return err
      res.redirect('/users/list')
    })
  })

  router.get('/edit/:id', helpers.isLoggedIn, function (req, res) {
    let sql = `SELECT * FROM users WHERE userid = ${req.params.id}`
    db.query(sql, (err, data) => {
      if (err) return err
      res.render('users/edit', {
        data: data.rows[0],
        user: req.session.user.userid, navs,
        isAdmin: req.session.user
      })
    })
  })

  router.post('/edit/:userid', helpers.isLoggedIn, (req, res) => {
    const { email, password, firstname, lastname, roles, isfulltime } = req.body

    let sql = `UPDATE users SET email = '${email}', password = ${password}, firstname = '${firstname}', lastname = '${lastname}', roles = '${roles}', isfulltime = ${isfulltime} WHERE userid = ${req.params.userid}`

    if (password.trim() == '') {
      sql = `UPDATE users SET email = '${email}', password = ${password}, firstname = '${firstname}', lastname = '${lastname}', roles = '${roles}', isfulltime = ${isfulltime} WHERE userid = ${req.params.userid}`
    }


    db.query(sql, (err) => {
      console.log(sql);
      if (err) { console.error("Eror Woooy", err) }
      res.redirect('/users/list')
    })
  })

  router.get('/delete/:id', helpers.isLoggedIn, (req, res) => {
    let sql = `DELETE FROM users WHERE userid = ${req.params.id}`
    db.query(sql, (err) => {
      if (err) return err
      res.redirect('/users/list')
    })
  })

  return router;
};