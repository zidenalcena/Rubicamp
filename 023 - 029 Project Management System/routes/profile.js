var express = require('express');
var router = express.Router();
var helpers = require('../helpers/util')
var navs = 2

module.exports = (db) => {

    /* =========================== PROFILE =========================== */
    router.get('/list', helpers.isLoggedIn, function (req, res, next) {

        db.query(`SELECT * FROM users WHERE userid = ${req.session.user.userid}`, (err, response) => {
            // console.log(response.rows[0])
            let pro = response.rows[0]
            // console.log(pro);

            res.render('profile/list', {
                title: 'Projects',
                user: req.session.user,
                pro, navs,
                isAdmin: req.session.user

            });
        });

    });

    router.post('/list', helpers.isLoggedIn, (req, res) => {

        let temp = []
        if (req.body.password) {
            temp.push(`password = ${req.body.password}`)
        }
        if (req.body.position) {
            temp.push(`roles = '${req.body.position}'`)
        }
        if (req.body.isfulltime) {
            temp.push(`isfulltime = '${req.body.isfulltime}'`)
            // console.log(req.body.isfulltime);
        }
        // console.log(req.body.position);

        let sql = `UPDATE users SET password = ${req.body.password}, roles = '${req.body.position}', isfulltime = ${(req.body.isfulltime ? true : false)} where userid = ${req.session.user.userid}`
        // console.log(sql);
        // console.log(req.session.user);
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/profile/list')
        })


    });


    return router;
};