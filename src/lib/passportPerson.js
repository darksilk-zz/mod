const passportPerson = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../database');
const helpers = require('../lib/helpers');
const ago = require('../lib/ago');

passportPerson.use('local.signin', new LocalStrategy({
    usernameField: 'person',
    passwordField: 'fingerprint',
    passReqToCallback: true
}, async (req, person, fingerprint, done) => {
    console.log("first if");
    const rows = await db.query('select * from person where name = ?', [person]);
    if(rows.length>0){
        console.log("first if");
        const user = rows[0]; 
        //const validPassword = await helpers.decryptPassword(password, user.password);
        if(fingerprint==user.fingerprint){
            console.log("Password is valid");
            console.log(fingerprint);
            console.log(user.fingerprint);
            done(null, user, req.flash('success', 'Bienvenido! Gracias por ejercer tu voto.'));
            //done(null, user);
        } else {
            console.log("Password is not valid");
            console.log(fingerprint);
            console.log(user.fingerprint);
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        console.log("Username doesnt exist");
        return done(null, false, req.flash('message', 'Nombre de usuario no existe'));
    }
}
));

passportPerson.serializeUser((user, done) => {
    done(null, user.id);
});

passportPerson.deserializeUser(async (id, done) => {
    const rows = await db.query('select * from person where id = ?', [id]);
    done(null, rows[0]);
});