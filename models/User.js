const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

//Create A Schema
const UserScheam = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        details:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

mongoose.model('users',UserScheam); 