var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blog');

require('./user');
require('./post');

exports.User = mongoose.model('User');
exports.Post = mongoose.model('Post');