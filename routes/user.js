const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport')

//Load Goal Model
require('../models/User');
const User = mongoose.model('users')

//User Login Route
router.get('/user/login', (req, res) => {
    res.render('user/login')
});

//User RegisterRoute
router.get('/user/register', (req, res) => {
    res.render('user/register')
});

// Login Form POST
router.post('/user/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/goals',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

//Register Form POST
router.post('/users/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({ text: 'password do not match ' });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'password must have Atleast 4 character' });
    }
    if (errors.length > 0) {
        res.render('user/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }
    else {

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already regsitered')
                    res.redirect('/user/register')
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(7, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Registration Successful You can Login now');
                                    res.redirect('/user/login')
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            });


    }
});

//Logout User
router.get('/user/logout', (req, res) => {
    req.logout();
    //req.flash('success_msg','You are Logged Out Succesfully');
    res.redirect('/');
});

module.exports = router;