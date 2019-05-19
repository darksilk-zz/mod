const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exhbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const {database} = require('./keys');
const db = require('./database');
const mongoose = require('mongoose');
const passport = require('passport');
var fs = require('fs')
//var Passport = require('passport').Passport, passport = new Passport(), personPassport = new Passport();

//Initialize
const app = express();
require('./lib/passport');

mongoose.connect('mongodb://192.168.56.104/fingervote', { useNewUrlParser: true })
  .then(db => console.log('DB Mongo connected'))
  .catch(err => console.log(err));

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
   /* helpers: {
        test: function(value){
            return value+7;
        }
    }*/
}));
app.set('view engine', '.hbs');
app.set('view engine', 'ejs');

//Middlewares
app.use(session({
    secret: 'secretWord',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));



app.use(flash());
//app.use(morgan('dev'));
/*app.use(morgan('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
  }))
// log all requests to access.log
app.use(morgan('common', {
    stream: fs.createWriteStream(path.resolve('C:/Users/danie/Desktop/share/access.log'), { flags: 'a' })
  }))*/
 /*aceptar dsde formularios los datos que envian los usuarios*/
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

/*
app.use(passportPerson.initialize());
app.use(passportPerson.session());
*/

//Global variables
app.use(async (req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/auth'))
app.use('/person', require('./routes/person'));
app.use('/polls', require('./routes/polls'));
app.use('/vote', require('./routes/vote'));
app.use('/users', require('./routes/users', () => {
    app.locals.user = req.user;
}));

//public files
app.use(express.static(path.join(__dirname, '/public')));

//start server
app.listen(app.get('port'), () => {
    console.log("Server on port", app.get('port'));
});