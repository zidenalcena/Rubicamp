var express = require('express');
var router = express.Router();
var helpers = require('../helpers/util')
var navs = 1;
var moment = require('moment')
var pathnode = require('path')
moment().format()

module.exports = (db) => {

    /* =========================== PROJECTS =========================== */
    router.get('/list', helpers.isLoggedIn, function (req, res, next) {
        // console.log(req.query);

        const { cprojectid, projectid, cname, name, cmember, member } = req.query;
        const url = (req.url == '/list') ? `/list?page=1` : req.url;
        const page = req.query.page || 1;
        const limit = 3;
        const offset = (page - 1) * limit;
        let params = [];

        if (cprojectid && projectid) {
            params.push(`projects.projectid = ${projectid}`);
        }
        if (cname && name) {
            params.push(`projects.name = '${name}'`);
        }
        if (cmember && member) {
            params.push(`members.userid = ${member}`);
        }
        // console.log(req.query);

        let sql = `SELECT COUNT(id) as total FROM (SELECT DISTINCT projects.projectid AS id FROM projects LEFT JOIN members ON projects.projectid = members.projectid`;
        if (params.length > 0) {
            sql += ` WHERE ${params.join(" AND ")}`
        }
        sql += `) AS projectmember`;

        db.query(sql, (err, count) => {
            const total = count.rows[0].total

            const pages = Math.ceil(total / limit)
            sql = `SELECT DISTINCT projects.projectid, projects.name FROM projects LEFT JOIN members ON projects.projectid = members.projectid`
            if (params.length > 0) {
                sql += ` WHERE ${params.join(" AND ")}`
            }
            // console.log(sql);
            sql += ` ORDER BY projects.projectid LIMIT ${limit} OFFSET ${offset}`
            let subquery = `SELECT DISTINCT projects.projectid FROM projects LEFT JOIN members ON projects.projectid = members.projectid`
            if (params.length > 0) {
                subquery += ` WHERE ${params.join(" AND ")}`
            }
            subquery += ` ORDER BY projects.projectid LIMIT ${limit} OFFSET ${offset}`
            let sqlMembers = `SELECT projects.projectid, CONCAT (users.firstname,' ',users.lastname) AS fullname FROM projects LEFT JOIN members ON projects.projectid = members.projectid LEFT JOIN users ON users.userid = members.userid WHERE projects.projectid IN (${subquery})`

            db.query(sql, (err, projectData) => {
                db.query(sqlMembers, (err, memberData) => {
                    // console.log(err, memberData);
                    projectData.rows.map(project => {
                        project.members = memberData.rows.filter(member => { return member.projectid == project.projectid }).map(item => item.fullname)
                    })
                    db.query('SELECT * FROM users', (err, data) => {
                        db.query(`SELECT optionproject from users WHERE userid = ${req.session.user.userid}`, (err, option) => {
                            res.render('projects/list', {
                                data: projectData.rows,
                                query: req.query,
                                users: data.rows,
                                navs, url, pages, page,
                                option: option.rows[0].optionproject,
                                isAdmin: req.session.user

                            });
                        });

                    });
                });
            });
        });

        // db.query(`SELECT * FROM projects`, (err, rowsdata) => {
        //     res.render('projects/list', {
        //         title: 'Projects',
        //         data: rowsdata.rows,
        //         query: req.query,
        //         user: req.session.user,
        //         navs
        //     });
        // });

    });

    router.get('/add', (req, res) => {

        db.query(`SELECT * FROM users ORDER BY userid`, (err, data) => {
            res.render('projects/add', {
                title: 'Project', navs,
                data: data.rows,
                user: req.session.user,
                isAdmin: req.session.user

            });
        });

    });

    router.post('/add', function (req, res, next) {
        let trynew = `SELECT nextval('projects_projectid_seq') AS nextid`
        db.query(trynew, (err, data) => {
            const projectid = data.rows[0].nextid

            trynew = `INSERT INTO projects(projectid, name) VALUES ('${projectid}','${req.body.addproject}')`

            db.query(trynew, (err, response) => {
                if (err) return res.send(err)

                if (typeof req.body.members == 'string') {
                    trynew = `INSERT INTO members (projectid, userid) VALUES (${projectid}, ${req.body.members})`
                } else {
                    trynew = `INSERT INTO members (projectid, userid) VALUES ${req.body.members.map((item) => `(${projectid},${item})`).join(',')}`
                }
                db.query(trynew, (err) => {
                    db.query(`UPDATE members SET role = subquery.roles FROM (SELECT userid, roles FROM users) AS subquery WHERE members.userid = subquery.userid`)
                    if (err) return res.send(err)
                    res.redirect('/projects/list')
                });
            });
        });

        // router.post('/add', function (req, res) {
        //     console.log(req.body);

        //     let tambah1 = req.body.addproject;
        //     // let tambah2 = req.body.member;
        //     console.log(req.body.project);

        //     let sql = `INSERT INTO projects(name) VALUES (${tambah1})`
        //     // let sql2 = `INSERT INTO users(userid, projectid) values ()`
        //     db.query(sql, [tambah1], (erur) => {
        //         console.log(sql);
        //         if (err) return err;
        //         res.redirect('/projects/list')
        //     });

        // });

    });

    router.get('/edit/:id', helpers.isLoggedIn, (req, res) => {
        let id = req.params.id;
        db.query(`SELECT * FROM projects where projectid = ${id}`, (err, projectData) => {
            if (err) return res.send(err)
            db.query(`SELECT userid FROM members where projectid = ${id}`, (err, memberData) => {
                if (err) return res.send(err)
                db.query('select userid, firstname, lastname, roles from users ORDER BY userid', (err, userData) => {
                    if (err) return res.send(err)
                    res.render('projects/edit', {
                        project: projectData.rows[0].name,
                        members: memberData.rows.map(item => item.userid),
                        users: userData.rows, navs, id,
                        isAdmin: req.session.user
                    });
                });
            });
        });
    });

    router.post('/edit/:id', helpers.isLoggedIn, (req, res) => {
        let projectid = req.params.id

        sqlProject = `UPDATE projects SET name = '${req.body.editproject}' WHERE projectid = ${projectid}`

        //mengosongkan dahulu member
        let sqlDeletemember = `DELETE FROM members where projectid =${projectid}`
        // console.log(req.body.editmemberproject);

        db.query(sqlDeletemember, (err) => {
            db.query(sqlProject, (err) => {
                let temp = []
                if (typeof req.body.editmemberproject == 'string') {
                    temp.push(`(${req.body.editmemberproject}, ${projectid})`)
                } else {
                    for (let i = 0; i < req.body.editmemberproject.length; i++) {
                        temp.push(`(${req.body.editmemberproject[i]}, ${projectid})`)
                    }
                }
                console.log(temp);
                let sql = `INSERT INTO members (userid, role, projectid) VALUES ${temp.join(",")}`
                console.log(sql);
                db.query(sql, (err) => {
                    if (err) return res.send(err)

                    res.redirect('/projects/list')
                })

            })
        })

        // const { name, member } = req.body
        // let id = req.params.id

        // console.log(member);
        // let sql = `UPDATE projects SET name = ${name} WHERE projectid = ${req.params.projectid}`;
        // db.query(sql, (err) => {
        //     db.query(`DELETE FROM members WHERE projectid = ${req.params.projectid}`, (err) => {
        //         let temp = []
        //         for (let i = 0; i < member.length; i++) {
        //             temp.push(`${member[i]}, ${id}`)
        //         }
        //         console.log(temp.join(","));

        //         let input = `INSERT INTO members (userid, role, projectid) VALUES ${temp.join(",")}`
        //         console.log(input);
        //         db.query(input, (err) => {
        //             res.redirect('/projects/list')
        //         })
        //     })
        // })

    })

    router.get('/delete/:id', helpers.isLoggedIn, (req, res) => {
        db.query(`DELETE FROM members WHERE projectid = ${req.params.id}`, (err) => {
            db.query(`DELETE FROM projects WHERE projectid = ${req.params.id}`, (err) => {
                // console.log(req.params.id);

                if (err) return err;
                res.redirect('/projects/list')
            });
        });
    });

    router.post('/optionproject', (req, res, next) => {
        let sql = `UPDATE users SET optionproject = '${JSON.stringify(req.body)}' WHERE userid = ${req.session.user.userid}`

        // console.log(sql)
        db.query(sql, (err, rows) => {
            res.redirect('/projects/list')
        });
    });

    /* =========================== OVERVIEW =========================== */
    router.get('/overview/:projectid', helpers.isLoggedIn, function (req, res, next) {
        let sidebar = 1;
        let projectid = req.params.projectid

        let sqlBug = `SELECT COUNT(tracker), (SELECT COUNT(*) FROM issues WHERE tracker ='Bug' AND projectid = ${projectid} AND status ='closed')
        AS closed FROM issues WHERE tracker = 'Bug' AND projectid = ${projectid} AND status != 'closed'`
        let sqlFeature = `SELECT COUNT(tracker), (SELECT COUNT(*) FROM issues WHERE tracker ='Feature' AND projectid = ${projectid} AND status ='closed')
        AS closed FROM issues WHERE tracker = 'Feature' AND projectid = ${projectid} AND status != 'closed'`
        let sqlSupport = `SELECT COUNT(tracker), (SELECT COUNT(*) FROM issues WHERE tracker ='Support' AND projectid = ${projectid} AND status ='closed')
        AS closed FROM issues WHERE tracker = 'Support' AND projectid = ${projectid} AND status != 'closed'`

        db.query(sqlFeature, (err, rowsFeature) => {
            db.query(sqlBug, (err, rowsBug) => {
                db.query(sqlSupport, (err, rowsSupport) => {
                    db.query(`SELECT users.firstname, users.lastname FROM users INNER JOIN members ON users.userid = members.userid WHERE projectid = ${projectid}`, (err, rows) => {
                        res.render('projects/overview', {
                            data: rows.rows,
                            projectid, navs, sidebar,
                            tracker: {
                                bug: rowsBug,
                                support: rowsSupport,
                                feature: rowsFeature
                            },
                            isAdmin: req.session.user


                        });
                    });
                })
            })
        });
    });

    /* =========================== ACTIVITY =========================== */
    router.get('/activity/:projectid', helpers.isLoggedIn, function (req, res, next) {
        let sidebar = 2;
        let projectid = req.params.projectid;

        let dayNow = moment().format('YYYY-MM-DD HH:mm:ss');//now
        let lastSevenDay = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')

        let sql = `SELECT * FROM activity WHERE time >= timestamp '${lastSevenDay}' AND time < timestamp '${dayNow}'`
        // console.log(sql);

        // var startdate = moment().subtract(1, "days").format("DD-MM-YYYY HH:mm:ss");
        // console.log(moment().subtract(1, "days").format("dddd"));

        db.query(sql, (err, rows) => {
            res.render('projects/activity', {
                isAdmin: req.session.user,
                title: 'activity',
                projectid, navs, sidebar,
                day: { dayNow, lastSevenDay }, moment,
                data: rows.rows,
                author: req.session.user.firstname
            });
        })



        // let sidebar = 2
        // let projectid = req.params.projectid;
        // let author = `${req.session.user}`
        // const today = new Date();
        // const sevenDaysBefore = new Date(today.getTime() - (6 * 24 * 60 * 60 * 1000));


        // const sql = `select activity.*, CONCAT(users.firstname,' ', users.lastname) as fullname  from activity left join users on activity.author = users.userid where time between '${moment(sevenDaysBefore).format('YYYY-MM-DD')}' and '${moment(today).add(1, 'days').format('YYYY-MM-DD')}' order by time desc`;
        // console.log(sql);

        // db.query(sql, (err, data) => {

        //     let result = {};
        //     data.rows.forEach((item) => {
        //         if (result[moment(item.time).format('dddd')] && result[moment(item.time).format('dddd')].data) {
        //             result[moment(item.time).format('dddd')].data.push(item);
        //         } else {
        //             result[moment(item.time).format('dddd')] = { date: moment(item.time).format('YYYY-MM-DD'), data: [item] };
        //         }
        //     })
        //     // console.log(JSON.stringify(result));
        //     // for (var i=0 in result){
        //     //     console.log("data Object", result[i])
        //     // }

        //     console.log("data", result);
        //     res.render('projects/activity', {
        //         projectid,
        //         identity: 'activity',
        //         data: result,
        //         today,
        //         sevenDaysBefore,
        //         moment, navs, sidebar,
        //         isAdmin: req.session.user


        //     })
        // })
    })

    /* =========================== MEMBERS =========================== */
    router.get('/members/:projectid', helpers.isLoggedIn, function (req, res) {

        const { cid, memberid, cmember, name, cposition, position } = req.query
        const url = (req.url == `/members/${req.params.projectid}`) ? `/members/${req.params.projectid}/?page=1` : req.url
        let sidebar = 3
        let temp = []
        let page = req.query.page || 1;
        let limit = 2;
        let offset = (page - 1) * limit

        if (cid && memberid) {
            temp.push(`id = ${memberid}`);
        }
        if (cmember && name) {
            temp.push(`CONCAT(firstname,' ', lastname) = '${name}'`);
        }
        if (cposition && positicposition) {
            temp.push(`members.role = ${position}`);
        }

        let sql = `SELECT count(*) as total FROM members WHERE members.projectid = ${req.params.projectid}`

        db.query(sql, (err, count) => {
            const total = count.rows[0].total
            const pages = Math.ceil(total / limit)
            let sqlmember = `SELECT projects.projectid, members.id, members.role, CONCAT (users.firstname,' ',users.lastname) AS fullname FROM members LEFT JOIN projects ON projects.projectid = members.projectid LEFT JOIN users ON users.userid = members.userid WHERE members.projectid = ${req.params.projectid}`;
            if (temp.length > 0) {
                sqlmember += ` AND ${temp.join(" AND ")}`
            }
            console.log(sqlmember);
            sqlmember += ` ORDER BY members.projectid LIMIT ${limit} OFFSET ${offset}`

            db.query(sqlmember, (err, data) => {
                db.query(`SELECT optionmember FROM users WHERE userid = ${req.session.user.userid}`, (err, option) => {
                    res.render('projects/members/list', {
                        projectid: req.params.projectid,
                        option: option.rows[0].optionmember,
                        data: data.rows,
                        navs, sidebar,
                        isAdmin: req.session.user,
                        query: req.query,
                        pages: pages,
                        url: url,
                        page: page
                    });
                })
            })
        })
    });

    router.post('/optionmember/:projectid', (req, res) => {
        let sql = `UPDATE users SET optionmember = '${JSON.stringify(req.body)}' WHERE userid = ${req.session.user.userid}`

        // console.log(sql)
        db.query(sql, (err) => {
            if (err) return err;
            res.redirect(`/projects/members/${req.params.projectid}`)
        })
    })

    router.get('/memberadd/:projectid', helpers.isLoggedIn, function (req, res) {
        let sidebar = 3
        let sqlmember = `SELECT userid FROM members WHERE projectid = ${req.params.projectid}`
        let sql = `SELECT userid, firstname, lastname FROM users WHERE userid NOT IN (${sqlmember}) `

        db.query(sql, (err, data) => {
            res.render('projects/members/add', {
                projectid: req.params.projectid,
                data: data.rows,
                navs, sidebar,
                isAdmin: req.session.user


            })
        })
    })

    router.post('/memberadd/:projectid', helpers.isLoggedIn, (req, res) => {
        const { member, position } = req.body
        let sql = `INSERT INTO members(userid, role, projectid) VALUES (${member}, '${position}', ${req.params.projectid})`;

        console.log(sql);

        db.query(sql, (er, data) => {
            res.redirect(`/projects/members/${req.params.projectid}`)
        })
    });

    router.get('/memberedit/:projectid/:id', helpers.isLoggedIn, function (req, res) {
        let sidebar = 3
        let sql = `SELECT users.firstname, users.lastname, role FROM members LEFT JOIN users ON users.userid = members.userid WHERE id = ${req.params.id} `
        console.log(sql);

        db.query(sql, (err, data) => {
            res.render('projects/members/edit', {
                projectid: req.params.projectid,
                data: data.rows[0],
                id: req.params.id,
                navs, sidebar,
                isAdmin: req.session.user


            });
        })
    });

    router.post('/memberedit/:projectid/:id', helpers.isLoggedIn, (req, res) => {
        const { position } = req.body
        let id = req.params.id
        let sql = `UPDATE members SET role = '${position}' WHERE id = ${id}`

        db.query(sql, (err) => {
            if (err) return err
            res.redirect(`/projects/members/${req.params.projectid}`)
        })
    })

    router.get('/memberdelete/:projectid/:id', (req, res) => {
        // console.log(req.body)
        let sql = `DELETE FROM members WHERE id = ${req.params.id}`
        db.query(sql, (err) => {
            if (err) return err
            res.redirect(`/projects/members/${req.params.projectid}`)
        })
    })

    /* =========================== ISSUES =========================== */

    router.get('/issues/:projectid', helpers.isLoggedIn, function (req, res) {
        const { cid, issueid, csubject, subject, ctracker, tracker } = req.query;
        // const url = (req.url == '/list') ? `/list?page=1` : req.url;
        // const page = req.query.page || 1;
        // const limit = 3;
        // const offset = (page - 1) * limit;

        let params = [];
        let sidebar = 4

        if (cid && issueid) {
            params.push(`issueid = ${issueid}`);
        }
        if (csubject && subject) {
            params.push(`subject = '${subject}'`);
        }
        if (ctracker && tracker) {
            params.push(`tracker = ${tracker}`);
        }
        // console.log(req.body);

        let sql = `SELECT * FROM issues WHERE projectid = ${req.params.projectid}`;
        if (params.length < 0) {
            sql += `AND ${temp.join(" AND ")}`
        }
        db.query(sql, (err, row) => {
            db.query(`SELECT optionissue FROM users WHERE userid = ${req.session.user.userid}`, (err, option) => {
                if (err) return err;
                res.render('projects/issues/list', {
                    data: row.rows,
                    option: option.rows[0].optionissue,
                    query: req.query,
                    projectid: req.params.projectid,
                    navs, sidebar,
                    isAdmin: req.session.user


                })
            })
        })
    })

    router.post('/optionissue/:projectid', helpers.isLoggedIn, (req, res) => {
        let sql = `UPDATE users SET optionissue = '${JSON.stringify(req.body)}' WHERE userid = ${req.session.user.userid}`

        // console.log(sql)
        db.query(sql, (err) => {
            if (err) return err;
            res.redirect(`/projects/issues/${req.params.projectid}`)
        });
    });

    router.get('/issuesadd/:projectid', helpers.isLoggedIn, function (req, res) {
        let sql = `SELECT projects.projectid, users.userid, users.firstname, users.lastname FROM members LEFT JOIN projects ON projects.projectid = members.projectid LEFT JOIN users ON members.userid = users.userid WHERE members.projectid = ${req.params.projectid}`

        let sidebar = 4
        db.query(sql, (err, data) => {
            res.render('projects/issues/add', {
                projectid: req.params.projectid,
                data: data.rows,
                navs, sidebar,
                isAdmin: req.session.user


            })
        })
    })

    router.post('/issueadd/:projectid', (req, res) => {
        let sql = `INSERT INTO issues(tracker, subject, description, status, priority, assignee, startdate, duedate, estimatedtime, done, files, projectid) VALUES ('${req.body.trackerissue}', '${req.body.subjectform}', '${req.body.descriptionform}', '${req.body.statusIssue}', '${req.body.priorityissue}', ${req.body.assigneeform}, '${req.body.startdateform}', '${req.body.duedateform}', ${req.body.estimatedform}, ${req.body.doneform}, '${req.body.sampleFile}', ${req.params.projectid})`

        // console.log(sql);
        // console.log(req.body);
        // console.log(req.params.projectid);

        db.query(sql, (err, response) => {
            res.redirect(`/projects/issues/${req.params.projectid}`)
        })
    })

    router.get('/issuesedit/:projectid/:issueid', helpers.isLoggedIn, function (req, res) {
        let sql = `SELECT * FROM issues WHERE issueid = ${req.params.issueid}`
        let sidebar = 4

        db.query(sql, (err, data) => {
            db.query(`SELECT users.userid, users.firstname, users.lastname from users`, (err, user) => {
                // console.log(sql)
                res.render('projects/issues/edit', {
                    user: user.rows,
                    projectid: req.params.projectid,
                    data: data.rows[0],
                    navs, sidebar, moment,
                    isAdmin: req.session.user


                })
            })
        })
    })

    router.post('/issuesedit/:projectid/:issueid', (req, res) => {
        const {
            trackerissue,
            subjectform,
            descriptionform,
            statusIssue,
            priorityissue,
            assigneeform,
            startdateform,
            duedateform,
            estimatedform,
            doneform,
            spenttime,
            targetversion,
            parentadd } = req.body;

        let upload = req.files.samplefile;
        let samplefile = upload.name.toLowerCase().replace('.', Date.now() + '.');
        console.log(req.files, samplefile);
        if (statusIssue == "Closed") {

            sql = `UPDATE issues SET tracker = '${trackerissue}',
                                        subject = '${subjectform}',
                                        description = '${descriptionform}',
                                        status = '${statusIssue}',
                                        priority = '${priorityissue}',
                                        estimatedtime = '${estimatedform}',
                                        done = '${doneform}',
                                        file = '${samplefile}',
                                        updateddate =  now(),
                                        closeddate = now(),
                                        parenttask = ${parentadd},
                                        spenttime = ${spenttime},   
                                        targetversion = '${targetversion}',
                                        author = '${req.session.user.userid}',
                                        startdate = '${startdateform}',
                                        duedate = '${duedateform}',
                                        assignee = ${assigneeform} WHERE issueid = ${req.params.issueid}`;
        } else {
            sql = `UPDATE issues SET tracker = '${trackerissue}',
                                         subject = '${subjectform}',
                                         description = '${descriptionform}',
                                         status = '${statusIssue}',
                                         priority = '${priorityissue}',
                                         estimatedtime = ${estimatedform},
                                         done = '${doneform}',
                                         file = '${samplefile}',
                                         updateddate =  now(),
                                         parenttask = ${parentadd.trim() == '' ? null : parentadd},
                                         spenttime = ${spenttime},   
                                         targetversion = '${targetversion}',
                                         author = '${req.session.user.userid}',
                                         startdate = '${startdateform}',
                                         duedate = '${duedateform}',
                                         assignee = ${assigneeform} WHERE issueid = ${req.params.issueid}`;
        }
        if (req.files) {
            upload.mv(pathnode.join(__dirname, `../public/images/${samplefile}`)), function (err) {
                if (err) console.log(err)
            }
        }

        console.log(sql);

        db.query(sql, (err) => {
            if (err) { console.log('fatal Error') }
            db.query(`SELECT users.firstname, users.lastname FROM users WHERE userid = ${req.session.user.userid}`, (err, row) => {
                let date = new Date();
                let title = `${subjectform} #${req.params.issueid} (${statusIssue})`;
                db.query(`INSERT INTO activity(title, description, author, time)VALUES('${title}','','${row.rows[0].firstname + ' ' + row.rows[0].lastname}', now())`, (err) => {
                    if (err) { console.log("error", err) }
                    res.redirect(`/projects/issues/${req.params.projectid}`)
                })
            })
        })
    })

    router.get('/issuesdelete/:projectid/:issueid', (req, res) => {
        console.log(req.body)
        let sql = `DELETE FROM issues WHERE issueid = ${req.params.issueid}`
        db.query(sql, (err) => {
            if (err) return err

            res.redirect(`/projects/issues/${req.params.projectid}`)
        })
    })

    return router;
};