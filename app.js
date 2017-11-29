//Module Dependencies
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//Map the global Promise - get rid of DeprecationWarning
mongoose.Promise = global.Promise;
//Connection to the Mongoose
mongoose.connect('mongodb://localhost/GoalPlanner-dev',{
    useMongoClient:true 
})
    .then(()=>{console.log('MongoDB Connected..')})
    .catch((err)=>{console.log(err)});

//Load Goal Model
require('./models/Goals');
const Goal = mongoose.model('Goals')

//Setting up the Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//body parser MiddleWare
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

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

// Goal Index Page
app.get('/goals',(req,res)=>{
    Goal.find({})
    .sort({date:'desc'})
    .then(goals=>{res.render('goals/index',{
        goals:goals
    }) })
    
})

//Add Goal Form 
app.get('/goals/add', (req, res) => {
    res.render('goals/add');
});

// Process Form
app.post('/addGoals',(req,res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({text:"please add the title"})
    }
    if(!req.body.details){
        errors.push({text:"please add the details"})
    }
    if(errors.length>0){
        res.render('goals/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        })
    }
    else{
        const newUser = {
            title:req.body.title,
            details:req.body.details,
        }
        new Goal(newUser)
        .save()
        .then(goal =>{
            res.redirect('/goals')
        }) 
    }
})

//setting up the port to 5000
const port = 5000;
//listening to the port on the server start
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});