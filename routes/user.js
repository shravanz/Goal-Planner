const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');

//User Login Route
router.get('/user/login',(req,res)=>{
    res.render('user/login')
    });
    
    //User RegisterRoute
    router.get('/user/register',(req,res)=>{
       res.render('user/register')
    })

module.exports = router;