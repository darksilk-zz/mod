const express = require('express');
const router = express.Router();
const db = require('../database');
const Votation = require('../model/votation');
const Poll = require('../model/polls');
const VoteControl = require('../model/votecontrol');
const passportPerson = require('passport');
const moment = require('moment');
const { isNotLoggedIn, isLoggedInPerson } = require('../lib/auth');

router.get('/welcome', (req, res) => {
    res.send("Hola votante!!");
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('./vote/login.hbs');
});

router.post('/login', (req, res, next) => {
    passportPerson.authenticate('local.signinPerson', {
        successRedirect: '/vote/polls',
        failureRedirect: '/vote/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('../');
});

router.get('/polls', isLoggedInPerson, async (req, res) => {
    const allPolls = await Poll.find({});
    const choose = await VoteControl.find({ person_id: req.user.curp });

    /*var filtered = polls.filter(function(el) { return el._id != "5cc27257faa2fd485ce43bde" && el._id != "5cb743df232ea749c0301462"; });*/
    var polls = [];
    allPolls.forEach((pollElement, i) => {
        if((pollElement.active == 1) && (pollElement.scopeSex == req.user.sex || pollElement.scopeSex == "Todos")){
            polls.push(pollElement)
        }
    })

    if(choose.length>0){
        polls.forEach((pollElement, i) => {
            choose[0].polls.forEach((chooseElement, j) => {
                if(chooseElement == pollElement._id){
                    polls.splice(i, 1);
               }
            });
        })
    }

    res.render('./vote/viewPolls.hbs', {
        polls,
        user: req.user,
    });
});

router.get('/vote/:_id', isLoggedInPerson, async (req, res) => {
    const { _id } = req.params;
    const polls = await Poll.find({ _id: _id });
    res.render('./vote/pollVotation.hbs', {
        polls
    });
});

router.post('/saveVote/:_id', isLoggedInPerson, async (req, res, next) => {
    const { _id } = req.params;
    var years = moment().diff(req.user.birthdate, 'years');

    await db.query(`select estado.nombre as nombreEstado, municipio.nombre as nombreMunicipio,
                    person.curp from person as person
                    join estados as estado on estado.id=person.estado_id
                    join municipios as municipio on municipio.id=person.municipio_id
                    where person.curp = ?`, [req.user.curp], async (err, person) => {

            var votation = new Votation({
                poll_id: _id,
                question: req.body.question,
                answer: req.body.chosenAnswer,
                municipio: person[0].nombreMunicipio,
                estado: person[0].nombreEstado,
                sex: req.user.sex,
                age: years
            });

            const personVote = await VoteControl.find({ person_id: person[0].curp })

            if (personVote.length == 0) {
                var votecontrol = new VoteControl({
                    person_id: person[0].curp,
                    polls: _id
                });
                await votecontrol.save();
            } else {
                console.log("Person vote else");
                VoteControl.updateOne(
                    { "person_id": person[0].curp },
                    { "$push": { "polls": _id } },
                    function (err, raw) {
                        if (err) return handleError(err);
                        console.log('Response from Mongo: ', raw);
                    }
                );
            }
            await votation.save();

            res.redirect('/vote/polls');
        })
});

module.exports = router;