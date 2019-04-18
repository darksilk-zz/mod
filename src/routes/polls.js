const express = require('express');
const router = express.Router();
const Poll = require('../model/polls');
const moment = require('moment');
const CronJob = require('cron').CronJob;
var cron = require('node-cron');
const { isLoggedIn, isNotLoggedIn, isLoggedInAdmin } = require('../lib/auth');

//new CronJob('*/5 * * * * *', async function() {
cron.schedule('1 * 1/1 * *', async function() {
    const polls = await Poll.find({});
    console.log("\nStarting Cronjob: ");
    var now = moment().unix();
    console.log(moment().format(), "     ", now);
    polls.forEach(async (element,i) => {
        if(element.active===0){
            if(now > element.dateStarEpoch && now < element.dateEndEpoch){
                const result = await Poll.updateOne({_id: element._id }, {active: 1});
                console.log(result);
            }else{
                console.log("Out of range to active", i+1, ":",element.question, 
                element.dateStart, element.dateStarEpoch, "    ", element.dateEnd, element.dateEndEpoch);
            }
        }else{
            console.log("Active poll", i+1, ":",element.question,
            element.dateStart, element.dateStarEpoch, "    ", element.dateEnd, element.dateEndEpoch);
            if(now > element.dateEndEpoch){
                const result = await Poll.updateOne({_id: element._id }, {active: 0});
                console.log(result);
            }
        }
    })
}, null, true, 'America/Mexico_City');

router.get('/', isLoggedIn, async (req, res) => {
    res.send("Hello");
});

router.get('/view', isLoggedIn, async (req, res) => {
    const us = req.user
    console.log(us);
    const polls = await Poll.find({});
    res.render('./polls/view.hbs', {
        polls,
        user: req.user
    });
});

router.get('/add', isLoggedIn, (req, res) => {
    res.render('./polls/add.hbs');
});

router.post('/add', isLoggedIn, async (req, res, next) => {
    var dates = (req.body.dateRange).split("-");
    var epochStart = moment(dates[0], "DD-MM-YYYY HH:mm").unix();
    var epochEnd = moment(dates[1], "DD-MM-YYYY HH:mm").unix();
    console.log("date ranges", req.body.dateRange);
    console.log("date start", dates[0]);
    console.log("date end", dates[1]);
    console.log("epoch start", epochStart)
    console.log("epoch end", epochEnd)
    console.log("epoch end", moment(dates[0], "DD-MM-YYYY HH:mm").format('DD-MM-YYYY HH:mm'))
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
    var dates = (req.body.dateRange).split("-");
    var epochStart = moment(dates[0], "DD-MM-YYYY HH:mm").unix();
    var epochEnd = moment(dates[1], "DD-MM-YYYY HH:mm").unix();
    var answers = req.body.answers;
    answers.forEach((element,i) => {
        if(element === ''){
            answers.splice(i, 1);
       } 
    });
    /*ans.forEach(function (value, i) {
        console.log(i, value);
    });*/
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
    var upsertData = poll.toObject();
    delete upsertData._id;
    await Poll.updateOne({ _id: id }, upsertData, (function (err, doc) {
        if (err || !doc) {
            throw 'Error';
        } else {
            res.redirect('/polls/view');
        }
    })
    );
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Poll.deleteOne({_id: id});
    res.redirect('/polls/view');
})

module.exports = router;