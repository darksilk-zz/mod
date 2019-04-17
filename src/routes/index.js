const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    console.log("Indx")
    res.render('index.hbs');
})

//var agenda = new Agenda(mongoose.connect('mongodb://localhost/encuestas-mongo', { useNewUrlParser: true }));
// or provide your own mongo client:
// var agenda = new Agenda({mongo: myMongoClient})
//router.get('/dash', Agendash(agenda));

//app.use('/dash', Agendash(agenda));

module.exports = router;