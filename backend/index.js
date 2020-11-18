const express = require('express')
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary')
const cookieParser = require('cookie-parser')
var session = require('express-session')
var stripe = require('stripe')('sk_test_d5oqBMqwCnaIkqZDOGwnfUse00gevHGKGj');
//stripe.setApiVersion('2020-03-20');

//display the html page
const { resolve } = require("path");
var path = "../noble-master"

//var cookieParser = require('cookie-parser')








const enableCors = (req, res, next) => {  
  //the original way
  res.header('Access-Control-Allow-Origin',req.headers.origin)
  res.header('Access-Control-Allow-Credentials',true)
  res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers',' Origin, Authorization, Content-Type, X-Request-With, X-Session-Id')
  res.header('Access-Control-Expose-Headers', 'Location, X-Session-Id')

  if(req.method === 'OPTIONS') {
      res.status(200).send("OK")
      //next()
  } else {
      next()
  }
}





//app.use(bodyParser.json()); // for parsing application/json


//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const app = express();
app.use(express.static(path));
app.use(enableCors);
app.use(bodyParser.json({limit: '50mb'}));
//app.use(session({secret:"hellafyeSecretbruh"}))



app.set('trust proxy', 1) // trust first proxy
app.use(session({

  /*genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },*/
  key:'sid',
  secret: 'hellafyeSecretbruh',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(cookieParser())
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


//app.put('/headline',putHeadline);
//app.use(cookieParser)



//require('./src/cloudinary.js').setup(app) 
require('./src/cloudinary.js')(app)
require('./src/users')(app)
require('./src/userInfo')(app)
require('./src/payments')(app)
//require('./src/save_customer')(app)



//app.use(isLoggedIn);
//app.use(mongo)
//app.post('/article', addArticle);
// app.get('/', hello);
//app.get('/articles', getArticles);
//app.get('/article/:id', getArticle);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
     const addr = server.address()
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
})