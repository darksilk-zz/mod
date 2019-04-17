const express = require('express');
const router = express.Router();
const db = require('../database');
const passport = require('passport');
const helpers = require('../lib/helpers');
const { isLoggedIn, isNotLoggedIn, isLoggedInAdmin } = require('../lib/auth');


router.get('/', (req, res) => {
    res.send("Hello person");
});

router.route('/add')
    .post(isLoggedIn, async (req, res) => {
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
    })

    .get(isLoggedIn, async (req, res) => {
        //const arrayEstados = JSON.stringify(await db.query('select id, nombre from estados'));
        const arrayEstados = await db.query('select id, nombre from estados');
        res.render('./person/add.hbs', {
            estados: arrayEstados
        },
        );
    });

router.put('/getMunicipio/:id', isLoggedIn, async (req, res) => {
    //console.log(req.body, req.params);
    const { id } = req.params;
    const arrayMunicipios = await db.query('select id, estado_id, nombre from municipios where estado_id= ?', [id]);
    res.send({
        arrayMunicipios: arrayMunicipios
    });
})

router.route('/search')
    .get(isLoggedIn, (req, res) => {
        res.render('./person/search.hbs')
    })

    .post(isLoggedIn, async (req, res) => {
        const toSearch = req.body.toSearch;
        console.log("buscar esto", toSearch);
        console.log("buscar esto 2", req.body.toSearch);
        console.log(toSearch);
        console.log(req.body);
        
        /*await db.query(`select * from person`, (err, peoplle) => {

                console.log(peoplle);
               
            })*/

        await db.query(`select person.id, person.name, person.lastname, person.surname, person.active, 
                        estado.nombre as nombreEstado, municipio.nombre as nombreMunicipio,
                        person.curp, person.birthdate
                        from person as person
                        join estados as estado on estado.id=person.estado_id
                        join municipios as municipio on municipio.id=person.municipio_id
                        where person.name regexp ? or person.curp regexp ?`, [toSearch,toSearch], (err, people) => {

                for (var i = 0; i < people.length; i++) {
                    if (people[i].active == '1') {
                        people[i].active = "Si";
                        

                    } else if (people[i].active == '0') {
                        people[i].active = "No";
                    }
                }
                console.log(people);
                res.render('./person/search.hbs', {
                    data: people
                })
            })
    });

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await db.query("select * from person where id = ?", [id], async (err, person) => {
        personData = await db.query(`select person.*, estado.nombre as nombreEstado, municipio.nombre as nombreMunicipio 
            from person as person
            join estados as estado on estado.id=person.estado_id
            join municipios as municipio on municipio.id=person.municipio_id
            where estado.id=? and municipio.id=? and person.id=?`, [person[0].estado_id, person[0].municipio_id, id]);
        estados = await db.query("select * from estados where id!=?", [person[0].estado_id]);
        municipios = await db.query("select * from municipios where estado_id=?", [person[0].estado_id]);
        res.render('./person/edit.hbs', {
            data: personData[0],
            estados,
            municipios
        })
    })
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    /*const { name, lastname, surname, birthdate, curp,
        estado, municipio, cp, address, address_num,
        address_letter } = req.body;
    const newPerson = {
        name,
        lastname,
        surname,
        birthdate,
        curp,
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
    };*/
    newPerson = req.body;
    await db.query('update person set ? where id = ?', [newPerson, id], (err, result) => {
        if (result) {
            console.log('Insertion Result: ', result);
            req.flash('success', 'Actualizado correctamente');
            res.redirect('#');
        } else if (err) {
            console.log('AN ERROR OCURRED!: ', err);
            req.flash('message', 'Ocurrió un error, intenta nuevamente')
        }
    });
});

router.get('/deactivate/:id', isLoggedIn, async (req, res, done) => {
    const { id } = req.params;
    const deactivate = {
        active: 0
    }
    await db.query("update person set ? where id=?", [deactivate, id], (err, result) => {
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

router.get('/activate/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    const activate = {
        active: 1
    }
    await db.query("update person set ? where id=?", [activate, id], (err, result) => {
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