const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log("Indx")
    res.render('index.hbs');
})

module.exports = router;