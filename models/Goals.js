const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

//Create A Schema
const GoalScheam = new Schema({
    title:{
        type:String,
        required:true
    },
    details:{
        type:String,
        details:true
    },
    user:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

mongoose.model('Goals',GoalScheam); 