






///////////HEYYYYYY. 

require('./users.js')
//require('.././model.js')
require('.././db.js')
require('.././index.js')
var md5 = require('md5')
const loggedInUser = 0
var crypto = require('crypto')
//var AES = require("crypto-js/aes");
//var SHA256 = require("crypto-js/sha256");

const uploadImage = require('./cloudinary')
var mongoose = require('mongoose')





///UserInfo Schema

var userInfoSchema = new mongoose.Schema(
  {firstName: String, lastName: String, 
    researchGroup: String, netId: String, sponsored: String, 
    email: String, atitle: String, onboardingEmail: Date,
    IRB: String, CITI: String, cyberSecurity: String, 
    confAgreement: String, IRB1: String, CITI1: String, cyberSecurity1: String, 
    confAgreement1: String, IRBr: String, CITIr: String, cyberSecurityr: String, 
    confAgreementr: String, vpnTickNum: Date , vpnAccess: Date,
    emailList: String , setupInstr: String
  })

userInfo  = mongoose.model('userInfo', userInfoSchema,'userInfo')


function getUsers(req,res,next) {
  
  userInfo.find({},(err,doc)=>{
  if (err){
    //res.status(400).send({error:err})
    console.log("nope")
  }
  else{
    if(doc){
      
      res.send(doc)      

   }
   else{
      console.log("close, but no doc")
    }
  }})


}



function getDoc(req,res) {
  
  var docrequested = req.body.thedoctype
  console.log("this is the doc requested ", docrequested)


  userInfo.findOneAndUpdate({firstName:"Jolisa"}, { },{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){
      
          if (docrequested == "confAgreement"){
            console.log(doc.confAgreement1)
            //res.send(doc)
            res.send({"link":doc.confAgreement1})
          }
          if (docrequested == "CITI"){
            res.send({"link":doc.CITI1})
          }
          if (docrequested == "IRB"){
            res.send({"link":doc.IRB1})
          }
          if (docrequested == "cyberSecurity"){
            res.send({"link":doc.cyberSecurity1})
          }
          
         }
        else{
           console.log("close")
        }
      }
    })


}

function putDocApproval(req,res) {
  
  var docrequested = req.body.thedoctype
  console.log("this is the doc requested ", docrequested)


  if (docrequested == "confAgreement"){
    userInfo.findOneAndUpdate({firstName:"Jolisa"}, {confAgreementr:"Yes" },{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){    
          console.log(doc)
          res.send(doc)   
         }
        else{
           console.log("close")
        }
      }
    }) }


    if (docrequested == "CITI"){
    userInfo.findOneAndUpdate({firstName:"Jolisa"}, {CITIr:"Yes" },{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){    
          console.log(doc)
          res.send(doc)  
         }
        else{
           console.log("close")
        }
      }
    }) }  
    if (docrequested == "IRB"){
    userInfo.findOneAndUpdate({firstName:"Jolisa"}, {IRBr:"Yes" },{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){    
          console.log(doc)
          res.send(doc)  
         }
        else{
           console.log("close")
        }
      }
    }) } 
    if (docrequested == "cyberSecurity"){
    userInfo.findOneAndUpdate({firstName:"Jolisa"}, {cyberSecurityr:"Yes" },{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){    
          console.log(doc)
          res.send(doc)  
         }
        else{
           console.log("close")
        }
      }
    })}
    }           


function putDocRejection(req,res) {
  
  var docrequested = req.body.thedoctype
  console.log("this is the doc requested ", docrequested)


  if (docrequested == "confAgreement"){
    userInfo.findOneAndUpdate({firstName:"Jolisa"}, {confAgreementr:"", confAgreement1:"", confAgreement:""  },{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){    
          console.log(doc)
          res.send(doc)   
         }
        else{
           console.log("close")
        }
      }
    }) }


    if (docrequested == "CITI"){
    userInfo.findOneAndUpdate({firstName:"Jolisa"}, {CITIr:"", CITI1:"", CITI:""  },{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){    
          console.log(doc)
          res.send(doc)  
         }
        else{
           console.log("close")
        }
      }
    }) }  
    if (docrequested == "IRB"){
    userInfo.findOneAndUpdate({firstName:"Jolisa"}, {IRBr:"", IRB1:"", IRB:""  },{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){    
          console.log(doc)
          res.send(doc)  
         }
        else{
           console.log("close")
        }
      }
    }) } 
    if (docrequested == "cyberSecurity"){
    userInfo.findOneAndUpdate({firstName:"Jolisa"}, {cyberSecurityr:"", cyberSecurity1:"", cyberSecurity:"" },{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){    
          console.log(doc)
          res.send(doc)  
         }
        else{
           console.log("close")
        }
      }
    })}
    }           


var cookieKey = 'sid'
function isLoggedIn(req,res,next) {
  var sid = req.cookies[cookieKey]
  if (!sid){
    return res.sendStatus(401)
  }
  console.log("sid here ", sid)
  var username = sessionUser[sid]
  console.log("username ", username)
  if (username){
    req.username = username
    next()

  }else{
    res.sendStatus(401)
  }
}

var theCount;
function countUsers(){
  //var theCount = 0
  //count;
  Users.countDocuments({}, function( err, count){
    //console.log( "Number of posts:", count )
    theCount = (count).toString()
    console.log("count" + count)
    console.log("theCount inside function")
    return (count);
    })
    console.log("theCount outside function" + theCount)
return theCount
}


function logout(req,res){
  //sesionUser.sessionKey = {}
  req.logout()
  res.send("yayyaya, logged out successfully")
  res.redirect("/")

}

function register(req,res){
  
  //const aUsername = "a username"
  const aUsername = req.body.username
  var password = req.body.password
  
  const registerDict = {username: aUsername}

   var totalUsers = 0
  
  //console.log("theCount" + theCount)
  //totalUsers = countUsers()
  //console.log("total Users"+ totalUsers)

  const mongoUser = {username:aUsername}
  const mongoProf = {username: aUsername, headline:"Today is the best day ever.", avatar:"" ,following:[], theId:"", email:req.body.email, dob:req.body.dob, zipcode:req.body.zipcode}

  /*require('crypto').randomBytes(48, function(err, buffer) {
    var salt = buffer.toString('hex');
  });*/

  var salt = require('crypto').randomBytes(16).toString('base64')

  //var salt =  new Date.getTime() + username
  
  var hash = getHash(password,salt)
  


  //insert a new document into the user collection and profile with the following information



  console.log(salt)
  console.log(hash)
  mongoUser.salt = salt
  mongoUser.hash = hash


  //db.users.insert(mongoUser)
  //db.profiles.insert(mongoProf)
  
  console.log(mongoUser)
  console.log(mongoProf)


 //add mongoUser to Users collection

  var newUser = new Users( mongoUser)
     //myPosts[posts].append(newArticle)
      
      newUser.save((function (err, result) {
        if (err) {
          console.log("whoopsies")
        }
        else{
          console.log("yayyayay, new User uploaded")
        }
        ;
          // saved!
        }));

 //add mongoProf to Profiles collection
   var newProfile = new Profiles( mongoProf)
     //myPosts[posts].append(newArticle)
      
      newProfile.save((function (err, result) {
        if (err) {
          console.log("whoopsies")
        }
        else{
          console.log("yayyayay, new Profile uploaded")
        }
        ;
          // saved!
        }));


  registerDict.result = "success"

  res.send(registerDict)

}

function getHash (aPassword, aSalt){
  //takes a dictionary with a password and salt and returns the hashed version
  var password = this.aPassword
  var theSalt = this.aSalt

  //i need to check on whether this is allowed

  
  
  
  //console.log(theSalt)
  //var hashedPass = crypto.createHash('md5').update(password+theSalt).digest("hex")
  var hashedPass = SHA256(password+theSalt)
  //var hashedPass = md5(this.aPassword+this.aSalt)


  //const hashedPass = hash(this.aPassword+this.aSalt)


  return hashedPass
}





function uploadit(req,res){
  console.log("received req here form upload")
  console.log(req)
  
  console.log(req.fileurl)
  var photo = req.fileurl
  
  var message = req.file.originalname

  var date;
  var doctype;
  var date = message.slice(0, 10)
  var doctype = message.slice(10)

  console.log("we have it here")
  console.log(req.file.originalname)

  
  //console.log(req.file.originalname)
  console.log("And we're doing well")
  console.log("this is the current photo")
  console.log(photo)
  console.log("date ", date)
  console.log("doc ", doctype)
  console.log("uploading cloud ", doctype+"1")
  var cloud = doctype+"1"

  //var password = req.body.password;
  if (!photo){
    ///potential user needs to have both a username and a password
    console.log("no photo received here")
    //res.sendStatus(400)
    return
  }

  console.log(cloud =="CITI1")
  console.log(doctype =="CITI")

  if (doctype == "confAgreement"){
  userInfo.findOneAndUpdate({firstName:"Jolisa"}, { 
    $set: {"confAgreement": date, "confAgreement1": photo}},{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){
      
          console.log("changed Doc with user image involved")
          console.log(doc)
          console.log(doc.confAgreement)
          res.send(doc.confAgreement)
         }
        else{
           console.log("close")
        }
      }
    })
  }
  if (doctype == "cyberSecurity"){
  userInfo.findOneAndUpdate({firstName:"Jolisa"}, { 
    $set: {"cyberSecurity": date, "cyberSecurity1": photo}},{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){
      
          console.log("changed Doc with user image involved")
          console.log(doc)
         }
        else{
           console.log("close")
        }
      }
    })
  }
  if (doctype == "CITI"){
  userInfo.findOneAndUpdate({firstName:"Jolisa"}, { 
    $set: {"CITI": date, "CITI1": photo}},{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){
      
          console.log("changed Doc with user image involved")
          console.log(doc)
         }
        else{
           console.log("close")
        }
      }
    })
  }
  if (doctype == "IRB"){
  userInfo.findOneAndUpdate({firstName:"Jolisa"}, { 
    $set: {"IRB": date, "IRB1": photo}},{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){
      
          console.log("changed Doc with user image involved")
          console.log(doc)
         }
        else{
           console.log("close")
        }
      }
    })
  }
}





var sessionUser = {}
//const cookieKey = 'sid'
//cookieKey is declared higher up in the doc above the isLoggedIn function
/*function login(req,res){
  var username = req.body.username;
  var password = req.body.password;
  if (!username|| !password){
    ///potential user needs to have both a username and a password
    res.sendStatus(400)
    return
  }

  Users.find({username: username},(err,doc)=>{
    if (err){
    //res.status(400).send({error:err})
    console.log("nope")
  }
  else{
    if(doc){

      console.log("AYYYYYYY!")
      var theDocument = doc
      var savedHash = doc[0].hash
      var savedSalt = doc[0].salt
      ///check to see whether the entered username and password match the ones on file

      
      var calculatedHash = getHash(password,savedSalt)
      console.log("doc"+doc)
      console.log("calculated Hash" +calculatedHash)
      console.log("username" + doc[0].username)
      console.log("saved salt" + savedSalt)
      console.log("saved Hash"+savedHash)
      var matching = (calculatedHash == savedHash)
      if(matching){
          //does it matter what i make my secret message??
         
         var theDate = new Date()
          var sessionKey = md5("topSecretMessage"+ (theDate).getTime() + firstname)
          console.log("session key" + sessionKey)
           //should this user information be the from the Users collection still? Or from the Profiles collection?
           sessionUser.sessionKey = doc
           sessionUser.cookieKey = 




           ////../////..//////...//////....
          //this sets a cookie
          res.cookie(cookieKey,sessionKey,{maxAge:3600*1000 ,httpOnly:true})
          //res.cookie(cookieKey,generateCode(userObj),{maxAge:3600*1000,httpOnly:true})
          var msg = {username:username, result:'success'}
          res.send(msg)
        }
        if (!matching){
          res.send("User name and password not on file")
        }
      }
      else{
        console.log("close, but no doc")
        res.send("Only Registered Users may log in. Please first register.")
      }

    }
  })
}*/
 




const getUserInfo = (req, res) => {

    //get a complete list of all users in database to later be displayed in table


   
    console.log("rew here")
    console.log(req)
     userInfo.find({}, function(err, docs){
      if (err){
        console.log("nope")
      }
      
      else{
        if(docs){
           //check to see if doc author is in followers list
           //the only issue is whether i'll be able to see this variable value
           
           //res.send("user info collected")





           res.send({users: docs})  
           return
       }
       else{
        console.log("close, but no doc")
       }
    }})
  }

    




   
/*const putPassword = (req,res) => {
  
  //change the password for the logged in user

  const newPassword = req.body.password
  
  //update their headline tag in the profiles list
  var passwordDict = {username:"jmb27", result:"success"}
  //profile.profiles[loggedInUser].password = newPassword
  //here we are updating

  


  Users.find({username:"jmb27"},(err,doc)=>{
  if (err){
    //res.status(400).send({error:err})
    console.log("nope")
  }
  else{
    if(doc){
      
      console.log("the doc unchanged")
      console.log(doc)
      console.log("new password"+newPassword)
      console.log("hashes before and after")
      console.log(getHash("dchapeme",doc.salt))
      console.log(getHash("dougey32",doc.salt))

      var newHash = getHash(newPassword, doc[0].salt)
      console.log("hash" + newHash)
      Users.findOneAndUpdate({username:"jmb27"},{hash:newHash},{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){
      
          console.log("changed Doc")
          console.log(doc)
         }
        else{
           console.log("close")
        }
      }
    })



   }
   else{
      console.log("close, but no doc")
    }
  }})




  



  res.send(passwordDict)
  

}*/


/*function upload(file, options, callback)
cloudinary.v2.uploader.upload("/ish.jpg", 
    function(error, result) {console.log(result, error)});*/



module.exports = (app) => {
  //app.get('/',(req,res)=>{res.send({a:"hello  world2 "})})
  app.get('/getusers', getUsers);
  app.put('/getdoc', getDoc);
  app.put('/putdocapproval', putDocApproval);
  app.put('/putdocrejection', putDocRejection);
  app.put('/uploadit', uploadImage('happy') , uploadit);
  //app.post('/login',login);
  //app.post('/register',register)
  app.get('/userInfo', getUserInfo)
  //app.put('/password', isLoggedIn, putPassword);
  //app.put('/password', putPassword);
  app.put('/logout',isLoggedIn, logout);
  //app.put('yea',)



  //STILL GOTTA IMPLEMENT THIS GUY
  //app.put('/logout',isLoggedIn,logout)
  
}