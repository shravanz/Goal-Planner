const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

//Load Goal Model
require('../models/Goals');
const Goal = mongoose.model('Goals')

// Goal Index Page
router.get('/goals', ensureAuthenticated, (req, res) => {
    Goal.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(goals => {
            res.render('goals/index', {
                goals: goals
            })
        })

})

//Add Goal Form 
router.get('/goals/add', ensureAuthenticated, (req, res) => {
    res.render('goals/add');
});

//Edit Goal Form 
router.get('/goals/edit/:_id', ensureAuthenticated, (req, res) => {
    Goal.findOne({
        _id: req.params._id
    })
        .then(goal => {
            if (goal.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/goals');
            } else {
                res.render('goals/edit', {
                    goal: goal
                });
            }

        })

});

// Process Form
router.post('/addGoals', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: "please add the title" })
    }
    if (!req.body.details) {
        errors.push({ text: "please add the details" })
    }
    if (errors.length > 0) {
        res.render('goals/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    }
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user._id
        }
        new Goal(newUser)
            .save()
            .then(goal => {
                req.flash('success_msg', 'your Goal is added')
                res.redirect('/goals')
            })
    }
});

//Edit Form Process
router.put('/goal/:_id', ensureAuthenticated, (req, res) => {
    Goal.findOne({
        _id: req.params._id
    })
        .then(goal => {
            //New values 
            goal.title = req.body.title,
                goal.details = req.body.details
            goal.save()
                .then(updatedGoal => {
                    req.flash('success_msg', 'your Goal is Update')
                    res.redirect('/goals');
                })
        });
});

//Delete Idea
router.delete('/goal/:_id', ensureAuthenticated, (req, res) => {
    Goal.remove({ _id: req.params._id })
        .then(() => {
            req.flash('success_msg', 'your Goal is Removed')
            res.redirect('/goals')
        })
});


module.exports = router;