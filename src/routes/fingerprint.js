const express = require('express');
const router = express.Router();
const db = require('../database');
const passport = require('passport');
const helpers = require('../lib/helpers');
const { isLoggedIn, isNotLoggedIn, isLoggedInAdmin } = require('../lib/auth');

router.get('/', (req, res) => {
    res.send('Quiubo');
})

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('./fingerprint/login.hbs');
});

module.exports = router;