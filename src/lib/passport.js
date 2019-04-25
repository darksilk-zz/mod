const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../database');
const helpers = require('../lib/helpers');
const ago = require('../lib/ago');

//var Passport = require('passport').Passport, passport = new Passport(), personPassport = new Passport();

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
    console.log("Passport user");
    const rows = await db.query('select * from users where username = ?', [username]);
    if(rows.length>0){
        
        var lastTimeLogged=new Date();
        db.query('update users set lastTimeLogged=? where id=?',[lastTimeLogged,rows[0].id])
        const user = rows[0]; 
        const validPassword = await helpers.decryptPassword(password, user.password);
        if(validPassword){
            console.log("Password is valid");
            done(null, user, req.flash('success', 'Ingresaste por ultima vez ' + ago.timeagoMoment(user.lastTimeLogged)));
            //done(null, user);
        } else {
            console.log("Password is not valid.");
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        console.log("Username doesnt exist");
        return done(null, false, req.flash('message', 'Nombre de usuario no existe'));
    }
}
));

passport.use('local.signinPerson', new LocalStrategy({
    usernameField: 'person',
    passwordField: 'fingerprint',
    passReqToCallback: true
}, async (req, person, fingerprint, done) => {
    const rows = await db.query('select * from person where name = ?', [person]);
    if(rows.length>0){
        const user = rows[0]; 
        //const validPassword = await helpers.decryptPassword(password, user.password);
        if(fingerprint==user.fingerprint){
            console.log("Password is valid");
            done(null, user, req.flash('success', 'Bienvenido! Gracias por ejercer tu voto.'));
            //done(null, user);
        } else {
            console.log("Password is not valid");
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        console.log("Username doesnt exist");
        return done(null, false, req.flash('message', 'Nombre de usuario no existe'));
    }
}
));

passport.serializeUser((user, done) => {
    
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    if(user.type==3){
        //console.log("This is a person");
        const rows = await db.query('select * from person where id = ?', [user.id]);    
        done(null, rows[0]);
    }else if(user.type==1 || user.type==2){
        //console.log("This is an user or admin");
        const rows = await db.query('select * from users where id = ?', [user.id]);
        done(null, rows[0]);
    }
    
    
});
    
    /*if(rows[0].type==3){

        const rows = await db.query('select * from users where id = ?', [user]);
    }
    if(!Object.keys(rows).length){
        console.log("Heello world");
        
    }*/
    