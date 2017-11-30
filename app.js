//Module Dependencies
const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

//DB Config
const db = require('./config/database');

//Map the global Promise - get rid of DeprecationWarning
mongoose.Promise = global.Promise;
//Connection to the Mongoose
mongoose.connect(db.mongoURI, {
    useMongoClient: true
})
    .then(() => { console.log('MongoDB Connected..') })
    .catch((err) => { console.log(err) });

//Load Routes
const goals = require('./routes/goals');
const users = require('./routes/user');

// Passport Config 
require('./config/passport')(passport);

//Setting up the Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//body parser MiddleWare
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Static Assets 
app.use(express.static(path.join(__dirname, 'public')));

//MiddleWare Method-Override which help in PUT Request
app.use(methodOverride('_method'));

//MiddleWare for Express-Session
app.use(session({
    secret: 'wumap',
    resave: true,
    saveUninitialized: true,
}));

//Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Set Global Variable
app.use(function (req, res, next) {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


//Setting up the Index Route
app.get('/', (req, res) => {
    const setTitle = 'Welcome to Goal-Planner';
    res.render('index',
        {
            title: setTitle
        }
    );
});

//Setting up the About Route
app.get('/about', (req, res) => {
    res.render('about');
});

// Using The Routes
app.use('/', goals);
app.use('/', users);

//setting up the port to 5050
const port = process.env.PORT || 5050;
//listening to the port on the server start
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});