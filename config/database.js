if(process.env.NODE_ENV === 'production'){
module.exports = {mongoURI:'mongodb://shravan:qwerty@ds125146.mlab.com:25146/goal-prod'}
}else{
module.exports = {mongoURI:'mongodb://localhost/GoalPlanner-dev'}
}