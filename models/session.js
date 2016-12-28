var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var sessionSchema = new Schema({
    id:             { type: String },
    username:       { type: String },
    token:          { type: String },
    lastConnect:    { type: Date }
});

module.exports = mongoose.model("Session", sessionSchema);