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
        const { id_person, username, password, CURP} = req.body;

        const existUser = await db.query('select * from users where username=?', [username]);
        const existUserCURP = await db.query('select user.id_person, person.curp, person.id from users as user join person as person on person.id=user.id_person where person.curp=?',[CURP]);

        if (typeof existUser !== 'undefined' && existUser.length > 0) {
            req.flash('message', 'Nombre de usuario no disponible.');
            res.redirect('/users/add');
        }else if (typeof existUserCURP !== 'undefined' && existUserCURP.length > 0) {
            req.flash('message', 'CURP ya asociada a un usuario.');
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
    .get(isLoggedInAdmin, (req, res) => {
        res.render('./users/add.hbs');
    });

router.put('/validateCURP/:curp', isLoggedInAdmin, async (req, res) => {
    const { curp } = req.params;
    await db.query('select id from person where curp=?', [curp], (err, idPerson) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                idPerson
            });
        }
    });
})

router.route('/search')
    .get(isLoggedInAdmin, (req, res) => {
        res.render('./users/search.hbs')
    })

    .post(isLoggedInAdmin, async (req, res) => {
        const toSearch = req.body.toSearch;
        
        await db.query(`select users.id, person.name, person.lastname, person.surname,  
                        estado.nombre as nombreEstado, municipio.nombre as nombreMunicipio, 
                        person.curp, users.username, users.active from person as person 
                        join estados as estado on estado.id=person.estado_id 
                        join municipios as municipio on municipio.id=person.municipio_id 
                        join users as users on users.id_person=person.id
                        where person.name regexp ? or person.curp regexp ?
                        or users.username regexp ?`, [toSearch,toSearch,toSearch], (err, user) => {

                for (var i = 0; i < user.length; i++) {
                    if (user[i].active == '1') {
                        user[i].active = "Si";
                        

                    } else if (user[i].active == '0') {
                        user[i].active = "No";
                    }
                }
                console.log(user);
                res.render('./users/search.hbs', {
                    data: user
                })
            })
    });

router.get('/deactivate/:id', isLoggedInAdmin, async (req, res, done) => {
    const { id } = req.params;
    const deactivate = {
        active: 0
    }
    await db.query("update users set ? where id=?", [deactivate, id], (err, result) => {
        if (result) {
            console.log('Insertion Result: ', result);
            req.flash('success', 'Actualizado correctamente');
            res.redirect('back');
        } else if (err) {
            console.log('AN ERROR OCURRED!: ', err);
            req.flash('message', 'Ocurrió un error, intenta nuevamente');
            res.redirect('back');
        }
    });
});

router.get('/activate/:id', isLoggedInAdmin, async (req, res, next) => {
    const { id } = req.params;
    const activate = {
        active: 1
    }
    await db.query("update users set ? where id=?", [activate, id], (err, result) => {
        if (result) {
            console.log('Insertion Result: ', result);
            req.flash('success', 'Actualizado correctamente');
            res.redirect(req.get('referer'));
        } else if (err) {
            console.log('AN ERROR OCURRED!: ', err);
            req.flash('message', 'Ocurrió un error, intenta nuevamente');
            res.redirect(req.get('referer'));
        }
    });

});

router.get('/deactivate/:id', isLoggedInAdmin, async (req, res, done) => {
    const { id } = req.params;
    const deactivate = {
        active: 0
    }
    await db.query("update users set ? where id=?", [deactivate, id], (err, result) => {
        if (result) {
            console.log('Insertion Result: ', result);
            req.flash('success', 'Actualizado correctamente');
            res.redirect('back');
        } else if (err) {
            console.log('AN ERROR OCURRED!: ', err);
            req.flash('message', 'Ocurrió un error, intenta nuevamente');
            res.redirect('back');
        }
    });
});

router.get('/activate/:id', isLoggedInAdmin, async (req, res, next) => {
    const { id } = req.params;
    const activate = {
        active: 1
    }
    await db.query("update users set ? where id=?", [activate, id], (err, result) => {
        if (result) {
            console.log('Insertion Result: ', result);
            req.flash('success', 'Actualizado correctamente');
            res.redirect(req.get('referer'));
        } else if (err) {
            console.log('AN ERROR OCURRED!: ', err);
            req.flash('message', 'Ocurrió un error, intenta nuevamente');
            res.redirect(req.get('referer'));
        }
    });

});

module.exports = router;