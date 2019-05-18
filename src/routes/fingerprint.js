const express = require('express');
const router = express.Router();
const db = require('../database');
const passport = require('passport');
const helpers = require('../lib/helpers');
const { isLoggedIn, isNotLoggedIn, isLoggedInAdmin } = require('../lib/auth');

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort("/dev/cu.usbmodem14101", { baudRate: 9600 })

const parser = new Readline()
port.pipe(parser)

parser.on('data', line => console.log(`> ${line}`))
port.write('1\n')

router.get('/', (req, res) => {
    res.send('Quiubo');
})

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('./fingerprint/login.hbs');
});

router.route('/add').post(isLoggedIn, async (req, res) => {
    console.log('Object Received from \'Add\' view: ', req.body)
    const { name, lastname, surname, birthdate, curp,
        estado, municipio, cp, address, address_num,
        address_letter } = req.body;
    const existPerson = await db.query('select * from person where curp=?', [curp]);

    if (typeof existPerson !== 'undefined' && existPerson.length > 0) {
        req.flash('message', 'CURP ya registrada!.');
        res.redirect('/person/add');
    }
    else {
        const newPerson = {
            name: name.toUpperCase(),
            lastname: lastname.toUpperCase(),
            surname: surname.toUpperCase(),
            birthdate,
            curp: curp.toUpperCase(),
            municipio_id: municipio,
            estado_id: estado,
            cp,
            address,
            address_num,
            address_letter,
            active: 1,
            type: 3,
            created_at: new Date(),
            created_by: req.user.username

        };
        await db.query('insert into person set ?', [newPerson], (err, result) => {
            if (result) {
                console.log('Insertion Result: ', result);
                req.flash('success', 'Persona guardada correctamente');
            } else if (err) {
                console.log('AN ERROR OCURRED!: ', err);
                req.flash('message', 'Ocurrio un error, intenta nuevamente')
            }
            res.redirect('/person/add');
        });
    }
}).get(isLoggedIn, async (req, res) => {
    //const arrayEstados = JSON.stringify(await db.query('select id, nombre from estados'));
    const arrayEstados = await db.query('select id, nombre from estados');
    res.render('./person/add.hbs', {
        estados: arrayEstados
    },
    );
});

module.exports = router;