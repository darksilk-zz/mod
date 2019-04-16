const express = require('express');
const router = express.Router();
const db = require('../database');
const passport = require('passport');
const helpers = require('../lib/helpers');
const {isLoggedIn, isNotLoggedIn, isLoggedInAdmin} = require('../lib/auth');


router.get('/', (req, res) => {
    res.send("Hello person");
});

router.route('/add')
    .post(isLoggedIn, async (req, res) => {
        console.log('Object Received from \'Add\' view: ', req.body)
        const { name, apellidoP, apellidoM, municipio, estado } = req.body;
        const newPerson = {
            name,
            apellidoP,
            apellidoM,
            municipio_id: municipio,
            estado_id: estado,
            active: 1
        };
        await db.query('insert into person set ?', [newPerson], (err, result) => {
            if (result) {
                console.log('Insertion Result: ', result);
                req.flash('success', 'Persona guardada correctamente');
            } else if (err) {
                console.log('AN ERROR OCURRED!: ', err);
                req.flash('message', 'An error ocurred, please try again')
            }
            res.redirect('/person/add');
        });
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
        await db.query(`select person.id, person.name, person.apellidoP, person.apellidoM, person.active, estado.nombre as nombreEstado, municipio.nombre as nombreMunicipio 
                        from person as person
                        join estados as estado on estado.id=person.estado_id
                        join municipios as municipio on municipio.id=person.municipio_id
                        where person.name regexp ?`, [toSearch], (err, people) => {
                for (var i = 0; i < people.length; i++) {
                    if (people[i].active == '1') {
                        people[i].active = "Si";
                    } else if (people[i].active == '0') {
                        people[i].active = "No";
                    }
                }
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
    /*const { name, apellidoP, apellidoM, municipio, estado } = req.body;
    const newPerson = {
        name,
        apellidoP,
        apellidoM,
        municipio_id: municipio,
        estado_id: estado
    };*/
    newPerson = req.body;
    await db.query('update person set ? where id = ?', [newPerson, id], (err, result) => {
        if (result) {
            console.log('Insertion Result: ', result);
            req.flash('success', 'Person saved successfully');
            res.redirect('#');
        } else if (err) {
            console.log('AN ERROR OCURRED!: ', err);
            req.flash('message', 'An error ocurred, please try again')
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
            req.flash('success', 'Updated successfully');
            res.redirect('back');
        } else if (err) {
            console.log('AN ERROR OCURRED!: ', err);
            req.flash('message', 'An error ocurred, please try again');
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
            req.flash('success', 'Updated successfully');
            res.redirect(req.get('referer'));
        } else if (err) {
            console.log('AN ERROR OCURRED!: ', err);
            req.flash('message', 'An error ocurred, please try again');
            res.redirect(req.get('referer'));
        }
    });

});

/*
router.post('/add', async(req, res) => {
    console.log('Object Received from \'Add\' view: ', req.body)
    const { name, apellidoP, apellidoM } = req.body;
    const newPerson= {
        name,
        apellidoP,
        apellidoM
    };
    await db.query('insert into person set ?', [newPerson]);
    req.flash('success', 'Person saved successfully');
    res.redirect('/person/add');
 });*/

/*router.put('/add/:id', async (req, res) => {
   //console.log(req.body, req.params);
   const { id } = req.params;
   const arrayMunicipios = await db.query('select id, estado_id, nombre from municipios where estado_id= ?', [id]);
   res.send({
       arrayMunicipios: arrayMunicipios
   });
   //console.log(arrayMunicipios);
})*/

module.exports = router;