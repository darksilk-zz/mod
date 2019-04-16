const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { id_person } = req.body;
    const newUser = {
        username,
        password,
        id_person,
        type: 1,
        active: 1,
        created_at: new Date()
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await db.query('insert into users set ?', [newUser]);
    console.log(result);
    newUser.id = result.insertId;
    //null es error, newUser es para guardar una sesion
    return done(null, newUser);

}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await db.query('select * from users where username = ?', [username]);
    if(rows.length>0){
        const user = rows[0]; 
        const validPassword = await helpers.decryptPassword(password, user.password);
        if(validPassword){
            console.log("Password is valid");
            //done(null, user, req.flash('success', 'Bienvenido ' + user.username));
            done(null, user);
        } else {
            console.log("Password is not valid");
            done(null, false, req.flash('message', 'Invalid password'));
        }
    } else {
        console.log("Username doesnt exist");
        return done(null, false, req.flash('message', 'Username does not exist'));
    }
}
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await db.query('select * from users where id = ?', [id]);
    done(null, rows[0]);
});