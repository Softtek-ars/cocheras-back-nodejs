var express = require('express');                 // framework

var bodyParser = require('body-parser');          // parse json
var mongoose = require('mongoose');               // use mongodb
var methodOverride = require("method-override");  // deploy and custom http verb
var morgan = require("morgan");                   // log every request to the console
var cors = require('cors');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

// Dependence of Controllers
var SessionModel = require('./models/Session');
require('./models/User');
require('./models/Garage');

// Controllers
var UsersCtrl = require("./controllers/users");
var SessionsCtrl = require("./controllers/sessions");
var GaragesCtrl = require('./controllers/garages');

// Router
var router = express.Router();

// Route of session (GET/POST/PUT/DELETE)
router.route("/session")
      .put(SessionsCtrl.updateById)
      .post(SessionsCtrl.addSession)
      .delete(SessionsCtrl.deleteById);

// Middleware to use for all requests (token validate)
router.use(function(req, res, next) {
    if(req.method != 'OPTIONS'){
        var authorization = req.headers.authorization;
        console.log('\n***Middleware - Token validation***');
        console.log('\nAuthorization: ' + authorization);
		
        if(authorization == undefined){
            console.log('Without authorization');
            res.status(403).json('HTTP Error [403]: Forbidden 1');
        }
        else{
            SessionModel.find({token: authorization}, function(err, session ){
                if(err){
                    console.log('ERROR: ' + err.message);
                    res.status(403).json('HTTP Error [403]: Forbidden 2');
                }
                else{
                    console.log('\nSession: ' + session);
                
                    if(session.length > 0){
                        next();
                    }
                    else{
                        res.status(403).json('HTTP Error [403]: Forbidden 3');
                    }
                }
            });
        }
	  }
	  else{
		  next();
	  }
      
      // make sure we go to the next routes and don't stop here
});

// Route of login (GET/PUT)
router.route("/user")
      .get(UsersCtrl.findById)
      .put(UsersCtrl.updateById);

router.route('/garages')
	  .get(GaragesCtrl.findAll)
	  .post(GaragesCtrl.add);

router.route('/garages/:id') 
	  .get(GaragesCtrl.findById)
	  .put(GaragesCtrl.update)
	  .delete(GaragesCtrl.delete);
	  
// Use api
app.use("/api", router);

// Connect to local mongodb
mongoose.connect('mongodb://localhost/Cocheras', function(err, res) {  
  if(err) {
    console.log('ERROR: connecting to Database. ' + err.message);
  }

  app.listen(8080, function() {
    console.log("Node server running on http://localhost:8080");
  });
});