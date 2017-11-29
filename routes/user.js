const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');

//User Login Route
router.get('/user/login',(req,res)=>{
    res.send('LOGIN');
    });
    
    //User RegisterRoute
    router.get('/user/register',(req,res)=>{
        res.send('register');
    })

module.exports = router;