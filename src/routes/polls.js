const express = require('express');
const router = express.Router();
const Poll = require('../model/polls');
const moment = require('moment');
const {isLoggedIn, isNotLoggedIn, isLoggedInAdmin} = require('../lib/auth');

router.get('/', (req, res) => {
    res.send("hello poll")
});

router.get('/date', (req, res) => {
    res.render('./polls/date.hbs');
});

router.get('/view', isLoggedIn, async (req, res) => {
    const polls = await Poll.find({});
    for (var i = 0; i < polls.length; i++) {
        if (polls[i].active == '1') {
            polls[i].active = "Si";
           
            
        } else if (polls[i].active == '0') {
            polls[i].active = "No";
            var num = "No"
            polls.push({num:[i].num});
            console.log(polls[i]);
       
        }
    }


    res.render('./polls/view.hbs', {
        polls
    });
});

router.get('/add', isLoggedIn, (req, res) => {
    res.render('./polls/add.hbs');
});

router.post('/add', isLoggedIn, async (req, res, next) => {
    var dates=(req.body.dateRange).split("-");
    var epochStart = moment(dates[0], "DD-MM-YYYY HH:MM").unix();
    var epochEnd = moment(dates[1], "DD-MM-YYYY HH:MM").unix();
    console.log("date ranges", req.body.dateRange);
    console.log("date start", dates[0]);
    console.log("date end", dates[1]);
    console.log("epoch start", epochStart)
    console.log("epoch end", epochEnd)
    console.log("epoch end", moment(dates[0], "DD-MM-YYYY HH:MM").format('DD-MM-YYYY HH:MM'))
    var poll = new Poll({
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
    res.redirect('./add');
});

router.get('/edit/:_id', isLoggedIn, async (req, res) => {
    const { _id } = req.params;
    const polls = await Poll.find({ _id: _id });
    res.render('./polls/edit.hbs', {
        polls
    });
});

router.post('/edit/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;

    var poll = new Poll({
        question: req.body.question,
        answers: req.body.answers
    });
    var upsertData = poll.toObject();
    delete upsertData._id;
    await Poll.updateOne({ _id: id }, upsertData, (function (err, doc) {
        if (err || !doc) {
            throw 'Error';
        } else {
            res.redirect('./view');
        }
    })
    );
});

module.exports = router;