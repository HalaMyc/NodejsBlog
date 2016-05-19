var mongoose = require('mongoose');

var User = require('../models').User;
//mongoose会将User转换为users

exports.getUserByName = function(name, callback) {
    User.findOne({'name': name}, callback);  
};

exports.newAndSave = function(name, password, callback){
    var user = new User();
    user.name = name;
    user.password = password;
    user.save(callback);
    
};