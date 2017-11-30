if(process.env.NODE_ENV === 'production'){
module.exports = {mongoURI:'mlab credentials'}
}else{
module.exports = {mongoURI:'mongodb://localhost/GoalPlanner-dev'}
}