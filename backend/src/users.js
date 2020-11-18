






///////////HEYYYYYY. 

require('./userInfo.js')
require('./payments.js')
//require('.././model.js')
require('.././db.js')
require('.././index.js')
var md5 = require('md5')
const loggedInUser = 0
var crypto = require('crypto')
//var AES = require("crypto-js/aes");
//var SHA256 = require("crypto-js/sha256");
const { resolve } = require("path");
var path = "../noble-master"






var mongoose = require('mongoose')

///Users Schema

var usersSchema = new mongoose.Schema({
  firstName: String, lastName: String, salt: String, hash: String
})

Users  = mongoose.model('User', usersSchema,'Users')






var cookieKey = 'sid'








function isLoggedIn(req,res,next) {
  console.log("authorization check at is logged in")
  //console.log("req here ", req)

  firstname = req.body.firstName
  lastname = req.body.lastName
  var sessionKey = md5("hellafyeSecretbruh" + firstname + lastname)
  var sid = req.cookies[cookieKey]

  if (!sid){
   
    return res.sendStatus(401)
  }
  var theuser = sid[sessionKey]
  var auser = sid['sessionKey']

  
  if (theuser || auser){
    req.firstname = firstname
    req.lastname = lastname
    next()

  }else{
    console.log("issue is no username")
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
  console.log("in the logout function")
  console.log("req ", req)
  firstname = req.body.firstName
  lastname = req.body.lastName
  var sessionKey = md5("hellafyeSecretbruh" + firstname + lastname)
  var sid = req.cookies[cookieKey]
  console.log("we're fine until here")
  sessionUser[sessionKey] = ""
  //req.logout()
  //cookies.set(sid[sessionKey], {maxAge: Date.now()});
  res.cookie(cookieKey,sessionUser,{maxAge:Date.now(),httpOnly:true})
  res.clearCookie('sid');
  console.log("sid here after being cleared", sid)


  //res.send("OK")
  //res.redirect('/')

}

function register(req,res){
  
  //const aUsername = "a username"
  //const aUsername = req.body.username
  console.log("now in new register function")


  const firstName = req.body.firstName

  const lastName = req.body.lastName

  var password = req.body.password
  console.log("first name is the foloowing: ")
  console.log(firstName)
  



  
  const registerDict = {firstName: firstName, lastName, lastName}

   var totalUsers = 0
  
  //console.log("theCount" + theCount)
  //totalUsers = countUsers()
  //console.log("total Users"+ totalUsers)

  const mongoUser = {firstName: firstName, lastName: lastName}
  /////////I CANNN CONTINUUUEEEE FROOMMM HEREE


  


  const mongoInfo = {firstName: firstName, lastName: lastName, 
    membershipTier: req.body.tier,
    email: req.body.email, phone: req.body.phone,
    emailListserve: req.body.emailList , textListserve: req.body.textList

  }

 

  var salt = crypto.randomBytes(16).toString('base64')

  //var salt =  new Date.getTime() + username
  
  var hash = md5(password+salt)
  


  //insert a new document into the user collection and with the following information



  console.log(salt)
  console.log(hash)
  mongoUser.salt = salt
  mongoUser.hash = hash


  //db.users.insert(mongoUser)
  //db.profiles.insert(mongoProf)
  
  console.log(mongoUser)
  console.log(mongoInfo)


 //add mongoUser to Users collection

  var newUser = new Users( mongoUser)
     //myPosts[posts].append(newArticle)
      
      newUser.save((function (err, result) {
        if (err) {
          console.log("whoopsies")
        }
        else{
          console.log(" new User registered")
        }
        ;
          // saved!
        }));

 //add mongoProf to Profiles collection
   var newInfo = new userInfo( mongoInfo)
     //myPosts[posts].append(newArticle)
      
      newInfo.save((function (err, result) {
        if (err) {
          console.log("whoopsies")
        }
        else{
          console.log("yayyayay, new userInfo uploaded")


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
  console.log("a password ", password)
  console.log("a salt ", salt)

  //i need to check on whether this is allowed

  
  
  
  //console.log(theSalt)
  //var hashedPass = crypto.createHash('md5').update(password+theSalt).digest("hex")
  
  console.log("testing md5 123: ", md5("123"+"2V85tWeE79s6M6r1QzTQtg=="))
  console.log("testing md5 124: ", md5("124"+"2V85tWeE79s6M6r1QzTQtg=="))
  var hashedPass = md5(password+theSalt)
  //var hashedPass = md5(this.aPassword+this.aSalt)


  //const hashedPass = hash(this.aPassword+this.aSalt)


  return hashedPass
}





var sessionUser = {}
var cookieKey = 'sid'
//cookieKey is declared higher up in the doc above the isLoggedIn function
function login(req,res){
  var firstname = req.body.firstName;
  var lastname = req.body.lastName;

  var password = req.body.password;
  console.log(firstname, lastname, password)
  if (!firstname|| !lastname || !password){
    ///potential user needs to have both a username and a password
    //res.sendStatus(400)
    res.send("both firstname, lastname, and password required for login")
    return
  }

  Users.find({firstName: firstname, lastName: lastname },(err,doc)=>{
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

      var calculatedHash = md5(password+savedSalt)
      //var calculatedHash = getHash(password,savedSalt)
      
      var matching = (calculatedHash == savedHash)
      if(matching){
          //does it matter what i make my secret message??
          var theDate = new Date()
          var sessionKey = md5("hellafyeSecretbruh" + firstname + lastname)
          //var sessionKey = md5("hellafyeSecretbruh"+ (theDate).getTime() + firstname + lastname)

          console.log("session key" + sessionKey)
           //should this user information be the from the Users collection still? Or from the Profiles collection?
           //sessionUser.sessionKey = doc
           


           sessionUser[sessionKey] = doc
           console.log("session user here at login ", sessionUser)
           console.log("session key here ", sessionKey)



           ////../////..//////...//////....
          //this sets a cookie
          res.cookie(cookieKey,sessionUser,{maxAge:3600*1000 ,httpOnly:true})
          


          var msg = {firstname:firstname, lastname:lastname, result:'success'}
          //need to get the account type from the server
          userInfo.findOneAndUpdate({firstName:firstname, lastName:lastname},{},{new:true},(err,doc)=>{
              if (err){
              //res.status(400).send({error:err})
              console.log("nope")
              }
             else{
               if(doc){
            
                console.log("successfully changed Doc")
                msg.atitle = doc.atitle
                console.log(doc)
               }
              else{
                 console.log("close")
              }
            }
          })



          console.log("final sent message from login")
          res.send(msg)
        }
        if (!matching){
          res.send("User not matched with password on file")
        }
      }
      else{
        console.log("close, but no doc")
        res.send("Only Registered Users may log in. Please first register with Data team.")
      }

    }
  })
}
 




   
const putPassword = (req,res) => {
  
  //change the password for the logged in user

  const newPassword = req.body.password
  console.log("password req here ", req.body)
  var firstname = req.body.firstName
  var lastname = req.body.lastName
  //update their headline tag in the profiles list
  var passwordDict = {firstName: firstname, lastName:lastname,result:"success"}
  //profile.profiles[loggedInUser].password = newPassword
  //here we are updating

  


  Users.find({firstName:firstname, lastName:lastname},(err,doc)=>{
  if (err){
    //res.status(400).send({error:err})
    console.log("nope")
  }
  else if(doc.length >0){
    if(doc){
      
      console.log("the doc unchanged")
      console.log(doc)

      
      //console.log(getHash("dchapeme",doc.salt))
      //console.log(getHash("dougey32",doc.salt))

      console.log("doc at 0 ", doc[0])
      var newHash = md5(newPassword+doc[0].salt)
      //var newHash = getHash(newPassword, doc[0].salt)
      console.log("hash" + newHash)
      Users.findOneAndUpdate({firstName:firstname, lastName:lastname},{hash:newHash},{new:true},(err,doc)=>{
        if (err){
        //res.status(400).send({error:err})
        console.log("nope")
        }
       else{
         if(doc){
      
          console.log("successfully changed Doc")
          console.log(doc)
         }
        else{
           console.log("close")
        }
      }
    })



   }
   else if(doc.length ==0){
      console.log("close, but no doc")
    }
  }})




  



  res.send(passwordDict)
  

}


module.exports = (app) => {
  //app.get('/a',(req,res)=>{res.send({a:"hello  world "})})













  

  app.get("/", (req, res) => {
  // Display checkout page
  const path = resolve(path + "/index.html");
  res.sendFile(path);
  });

 


  
  app.post('/login',login);
  app.post('/register',register)
  app.post('/payment',register)
  //app.put('/password', isLoggedIn, putPassword);
  app.put('/password', isLoggedIn, putPassword);
  app.put('/logout',isLoggedIn, logout);
  
  
}