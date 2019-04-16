const express = require('express');
const router = express.Router();
const db = require('../database');
const passport = require('passport');
const helpers = require('../lib/helpers');
const { isLoggedIn, isNotLoggedIn, isLoggedInAdmin } = require('../lib/auth');


router.get('/', (req, res) => {
    res.render("./users/index.hbs");
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('../');
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('./users/login.hbs');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/users',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.route('/add')
    .post(isLoggedInAdmin, async (req, res, done) => {
        console.log('Object Received from \'Add\' view: ', req.body)
        const { id_person, username, password } = req.body;

        const existUser = await db.query('select * from users where username=?', [username]);

        if (typeof existUser !== 'undefined' && existUser.length > 0) {
            req.flash('message', 'Nombre de usuario no disponible.');
            res.redirect('/users/add');
        }
        else {
            const newUser = {
                username,
                password,
                id_person,
                type: 2,
                active: 1,
                created_at: new Date(),
                created_by: req.user.username
            };
            newUser.password = await helpers.encryptPassword(password);
            console.log("password encriptado");
            await db.query('insert into users set ?', [newUser], (err, result) => {
                if (result) {
                    console.log('Insertion Result: ', result);
                    req.flash('success', 'Nuevo usuario creado correctamente!');
                } else if (err) {
                    console.log('AN ERROR OCURRED!: ', err);
                    req.flash('message', 'Ocurrio un error, intenta nuevamente mas tarde.')
                }
                res.redirect('/users/add');
            });
        }
    })
    .get(isLoggedInAdmin, async (req, res) => {
        res.render('./users/add.hbs');
    });

router.put('/validateCURP/:curp', async (req, res) => {
    const { curp } = req.params;
    await db.query('select id from person where name=?', [curp], (err, idPerson) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                idPerson
            });
        }
    });
})

module.exports = router;