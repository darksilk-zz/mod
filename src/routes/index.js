const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    console.log("Indx")
    res.render('index.hbs');
})

module.exports = router;