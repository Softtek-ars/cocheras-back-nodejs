var mongoose = require("mongoose");
var md5 = require('md5');
var ldap = require('ldap');

var Session = mongoose.model("Session");
var User = mongoose.model("User");

//POST - Insert a new Session in the DB
exports.addSession = function(req, res) {  
    
    console.log('\n--------------------------------------------------------');
    console.log('POST - Session.addSession');
    console.log('--------------------------------------------------------\n');
    
    var sessionUserId = req.body.username;
    var sessionPassword = req.body.password;
    var sessionDate = Date.now();
    
    var userId = "";
    var userName = "";

    console.log('Session UserId: ' + sessionUserId);
    console.log('Session Password: ' + sessionPassword);
    console.log('Session Date: ' + sessionDate);

    // Verify login
    User.find({id: sessionUserId}, function(userErr, user) {
        if(userErr){
            console.log('HTTP Error [500]: ' + userErr.message);
            return res.status(500).send(userErr.message);
        }
        else{
            if (user.length > 0)
            {
                console.log('\nUser: ');
                console.log('-----\n');
                console.log(user);

                // Login OK
                userId = user[0]._id;
                userName = user[0].name;
                userPassword = user[0].password;

                console.log('\nUserId: ' + userId);
                console.log('UserName: ' + userName);

                // Check session open
                Session.find({id: sessionUserId}, function(err, session) {
                    if(err){
                        console.log('HTTP Error [500]: ' + err.message);
                        return res.status(500).send(err.message);
                    }
                    else{
                        // http://www.sebastianseilund.com/nodejs-async-in-practice
                        // async.series
                        // async.parallel
                        
                        // Check LDAP access

                                    
                        //## LDAP Properties
                        //ldap.url=ldap://192.168.0.16:389
                        //ldap.base=dc=softtek,dc=com
                        //ldap.dn=MCS
                        //ldap.password=STKmcs2011
                        //ldap.user.search.filter=(sAMAccountName={0})
                        

                        
                        console.log('\n\nCreating LDAP client...');

                        // Client
                        var client = ldap.createClient({
                            url: 'ldap://192.168.0.16:389'
                        });
                        
                        // Binding
                        console.log('\nBinding to LDAP Server...');

                        client.bind('MCS', 'STKmcs2011', function (error) {
                        //client.bind('nicolas.fernandez@softtek.com', 'Nof*2016', function (error) {
                            var opts = {
                                filter: '(sAMAccountName=nicolas.fernandez@softtek.com)',
                                scope: 'sub'
                            };  

                            console.log('\nSearching...');

                            client.search('dc=softtek,dc=com', opts, function(err, res) {
                                res.on('searchEntry', function(entry) {
                                    console.log('entry: ' + JSON.stringify(entry.object));
                                });

                                res.on('searchReference', function(referral) {
                                    console.log('referral: ' + referral.uris.join());
                                });

                                res.on('error', function(err) {
                                    console.error('error: ' + err.message);
                                });
                                
                                res.on('end', function(result) {
                                    console.log('Result: ' + result);
                                    console.log('status: ' + result.status);

                                    //Unbinding
                                    console.log('\nUnbinding to LDAP Server...');
                                    client.unbind(function(error) {
                                        if(error){
                                            console.log(error.message);
                                        } 
                                        else{
                                            console.log('Client disconnected');
                                        }
                                    });
                                });
                            });
                        });
                        

                        console.log('\nSession:');
                        console.log('------\n');
                        console.log(session);

                        var sessionId = "";
                        var token = "";
                        var result = null;
                        var status = false;

                        if (session.length > 0)
                        {
                            sessionId = session[0]._id;
                            token = session[0].token;
                        }

                        // New session
                        if (!token){
                            // create token
                            token = md5(sessionUserId + sessionPassword + sessionDate);
                            
                            var newSession = new Session({  id:             sessionUserId,
                                                            token:          token,
                                                            lastConnect:    sessionDate });

                            console.log('\nSave (new):');
                            console.log('-----------\n');
                            console.log(newSession);

                            newSession.save(function(err) {
                                if(err){
                                    console.log("\nSession can't save. Error: " + err.message);
                                    return res.status(500).send(err.message);
                                }
                                else{
                                    console.log('\nSession sent:');
                                    console.log('-------------\n');
                                    console.log(newSession);

                                    console.log("\nSession save successfully!\n");

                                    return res.status(200).jsonp(newSession);
                                }
                            });
                        }
                        else{
                            Session.findById(sessionId, function(err, session) {
                                session.lastConnect = sessionDate;

                                console.log('\nSave (exists):');
                                console.log('--------------\n');
                                console.log(session);
                                
                                session.save(function(err) {
                                    if(err){
                                        console.log("\nSession can't save. Error: " + err.message);
                                        return res.status(500).send(err.message);
                                    }
                                    else{
                                        console.log('\nSession sent:');
                                        console.log('-------------\n');
                                        console.log(session);

                                        console.log("\nSession save successfully!\n");

                                        return res.status(200).jsonp(session);
                                    }
                                });
                            });
                        }
                    }
                });
            }else{
                console.log('HTTP Error [500]: Autentication failure');
                return res.status(500).send('Autentication failure');
            }
        }
    });
};

//PUT - Update a register already exists
exports.updateById = function(req, res) {  
    Session.findById(req.params.id, function(err, session) {
        session.lastConnect = req.body.lastConnect;

        session.save(function(err) {
            if(err){
                return res.status(500).send(err.message);
            }
            else{
                res.status(200).jsonp(session);
            }
        });
    });
};

//DELETE - Delete a Session with specified ID
exports.deleteById = function(req, res) {  
    Session.findById(req.params.id, function(err, session) {
        session.remove(function(err) {
            if(err){
                return res.status(500).send(err.message);
            }
            else{
                res.status(200).send();
            }
        })
    });
};