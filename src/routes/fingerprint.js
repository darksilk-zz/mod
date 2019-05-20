const express = require('express');
const router = express.Router();
const db = require('../database');
const passportPerson = require('passport');
const helpers = require('../lib/helpers');
const { isLoggedIn, isNotLoggedIn, isLoggedInAdmin } = require('../lib/auth');

router.get('/', (req, res) => {
    res.send('Quiubo');
})

router.get('/login', isNotLoggedIn, async (req, res) => {
    res.render('./fingerprint/login.hbs');
});

router.post('/login', (req, res, next) => {
    passportPerson.authenticate('local.signinPerson', {
        successRedirect: '/vote/polls',
        failureRedirect: '/vote/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/add', isNotLoggedIn, async (req, res) => {
    const arrayEstados = await db.query('select id, nombre from estados');
    var auto_increment = await db.query("SELECT AUTO_INCREMENT as id FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'finger_vote' AND TABLE_NAME = 'person'");
    res.render('./fingerprint/add.hbs', {
        id: auto_increment[0].id,
        estados: arrayEstados
    });
});

router.route('/add').post(isNotLoggedIn, async (req, res) => {
    console.log('Object Received from \'Add\' view: ', req.body)
    const { name, lastname, surname, birthdate, curp,
        estado, municipio, cp, address, address_num,
        address_letter, fingerprint } = req.body;
    const existPerson = await db.query('select * from person where curp=?', [curp]);

    if (typeof existPerson !== 'undefined' && existPerson.length > 0) {
        req.flash('message', 'CURP ya registrada!.');
        res.redirect('/person/add');
    }
    const newPerson = {
        name: name.toUpperCase(),
        lastname: lastname.toUpperCase(),
        surname: surname.toUpperCase(),
        birthdate,
        curp: curp.toUpperCase(),
        municipio_id: municipio,
        fingerprint: fingerprint,
        estado_id: estado,
        cp,
        address,
        address_num,
        address_letter,
        active: 1,
        type: 3,
        created_at: new Date(),
        created_by: 1
    };
    await db.query('insert into person set ?', [newPerson], (err, result) => {
        if (result) {
            console.log('Insertion Result: ', result);
            req.flash('success', 'Usuario generado correctamente');
        } else if (err) {
            console.log('AN ERROR OCURRED!: ', err);
            req.flash('message', 'Ocurrio un error, intenta nuevamente')
        }
        res.redirect('/fingerprint/login');
    });
});

module.exports = router;