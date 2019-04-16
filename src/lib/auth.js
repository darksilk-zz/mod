const db = require('../database');

async function isAdmin(username) {
    const result = await db.query('select * from users where username=?', [username])
    return await result[0].type;
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

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {

            return next();
        }
        return res.redirect('/profile');
    }
};
