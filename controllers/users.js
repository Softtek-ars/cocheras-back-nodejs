var mongoose = require("mongoose");
var User = mongoose.model("User");

//GET - Return a User with specified ID
exports.findById = function(req, res) {  
    User.findById(req.params.id, function(err, user) {
        if(err){
            return res.send(500, err.message);
        }
        else{
            console.log('GET /user/' + req.params.id);
            res.status(200).jsonp(user);
        }
    });
};

//GET - Return all registers
exports.findAll = function(req, res) {
    console.log('\n--------------------------------------------------------');
    console.log('GET /users')
    console.log('--------------------------------------------------------\n');

    User.find(function(err, users) {
        if(err){
            res.send(500, err.message);
        }
        else{
            console.log("Users sent:")
            console.log("-------------\n");
            console.log(users);
            console.log("\n");
            res.status(200).jsonp(users);
        }
    });
};

//PUT - Update a register already exists
exports.updateById = function(req, res) {  
    User.findById(req.params.id, function(err, user) {
        user.autoLogin   = req.body.autoLogin;
        
        user.save(function(err) {
            if(err){
                return res.status(500).send(err.message);
            }
            else{
                res.status(200).jsonp(user);
            }
        });
    }); 
};