var mongoose = require('mongoose');


var userShema = mongoose.Schema({
    name: String,
    password: String,
    email: String
});
mongoose.model('User', userShema);