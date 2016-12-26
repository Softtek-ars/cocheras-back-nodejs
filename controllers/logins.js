var mongoose = require("mongoose");
var Login = mongoose.model("Login");

//GET - Return a Login with specified ID
exports.findById = function(req, res) {  
    Login.findById(req.params.id, function(err, login) {
        if(err){
            return res.send(500, err.message);
        }
        else{
            console.log('GET /login/' + req.params.id);
            res.status(200).jsonp(login);
        }
    });
};

//PUT - Update a register already exists
exports.updateLogin = function(req, res) {  
    Login.findById(req.params.id, function(err, login) {
        login.autoLogin   = req.body.autoLogin;
        
        login.save(function(err) {
            if(err){
                return res.status(500).send(err.message);
            }
            else{
                res.status(200).jsonp(login);
            }
        });
    });
};