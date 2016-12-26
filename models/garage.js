var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var garageSchema = new Schema({
    garage:       { type: String },
    estado:       { type: String }
});

module.exports = mongoose.model('Garage', garageSchema);