const express = require('express');
const router = express.Router();
const db = require('../database');
const Poll = require('../model/polls');
const passportPerson = require('passport');
const helpers = require('../lib/helpers');
const { isNotLoggedIn, isLoggedInPerson } = require('../lib/auth');

router.get('/welcome', (req, res) => {
    res.send("Hola votante!!");
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('./vote/login.hbs');
});

router.post('/login', (req, res, next) => {
    console.log("hello world")
    
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
    const polls = await Poll.find({});

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
    console.log(req.body.chosenAnswer);
    console.log(_id);
    
    /*var poll = new Poll({
        question: req.body.question,
        description: req.body.description,
        dateStart: dates[0],
        dateEnd: dates[1],
        dateStarEpoch: epochStart,
        dateEndEpoch: epochEnd,
        active: 0,
        created_at: new Date(),
        created_by: req.user.username,
        answers: req.body.answers
    });

    await poll.save();
    res.redirect('./add');*/
});

module.exports = router;