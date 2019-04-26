const db = require('../database');

async function isAdmin(username) {
    try {
        const result = await db.query('select * from users where username=?', [username])
        return await result[0].type;
    } catch (err) {
        return err;
    }
    /*
    console.log("function")
    const result = await db.query('select * from users where username=?', [username])
    return await result[0].type;*/
}

async function isPerson(curp) {
    try {
        const result = await db.query('select * from person where curp=?', [curp])
        return await result[0].type;
    } catch (err) {
        return err;
    }
   /*const result = await db.query('select * from person where curp=?', [curp])
    return await result[0].type;*/
}

module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    },

    isLoggedInAdmin(req, res, next) {
        isAdmin(req.user.username).then(result => {
            if (req.isAuthenticated() && result == 1) {
                return next();
            }
            return res.redirect('/');
        })
    },

    isLoggedInPerson(req, res, next) {
        isPerson(req.user.curp).then(result => {
            if (req.isAuthenticated() && result == 3) {
                return next();
            }
            return res.redirect('/');
        })
    },

    isLoggedInUser(req, res, next) {
        isAdmin(req.user.username).then(result => {
            if (req.isAuthenticated() && result == 2 || result == 1 ) {
                return next();
            }
            return res.redirect('/');
        })
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {

            return next();
        }
        return res.redirect('/profile');
    }
};
