
// module database.js
var mongodb= require('mongodb');
var MongoClient= mongodb.MongoClient;
var URL = 'mongodb://127.0.0.1:27017/mainDB';

var db;
var error;
var waiting = []; // Callbacks waiting for the connection to be made

MongoClient.connect(URL, { useNewUrlParser: true },function(err,database){
  error = err;
  db = database;
  
  console.log("database ish has gone through")

  waiting.forEach(function(callback) {
    callback(err, database);
  });
});

module.exports = function(callback) {
  if (db || error) {
    callback(error, db);
  } else {
    waiting.push(callback);
  }
}

db.profiles.update({id:loggedInUser}, {$set: {
       headline: newHeadline,
       }}) 












/*const mongoose = require('mongoose')
//connect to mongodb
mongoose.connect('mongodb://localhost/ayy')

mongoose.connection.once('open',function(){
   console.log("Connection has been made, now make fireworks...")


	}).on('error', function(error){
		console.log('Connection error:', error)
	});*/