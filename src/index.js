const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exhbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const {database} = require('./keys');
const db = require('./database');
const mongoose = require('mongoose');

//Initialize
const app = express();
require('./lib/passport');

mongoose.connect('mongodb://localhost/encuestas-mongo', { useNewUrlParser: true })
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
app.use(morgan('dev'));
 /*aceptar dsde formularios los datos que envian los usuarios*/
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/users', require('./routes/users', () => {
    app.locals.user = req.user;
}));

//public files
app.use(express.static(path.join(__dirname, '/public')));

//start server
app.listen(app.get('port'), () => {
    console.log("Server on port", app.get('port'));
});