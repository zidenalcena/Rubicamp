var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    fullname: {type: String},
    message: {type: String}
})

module.exports = mongoose.model('Users', userSchema)