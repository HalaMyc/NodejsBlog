var mongoose = require('mongoose');
var Post = require('../models').Post;



exports.getAllPost = function(callback){
  Post.find(callback);
}

exports.getPostByName = function(name, callback) {
  Post.findOne({'name': name}, callback);
}

exports.getPostOne = function(name, day, title, callback) {
  Post.findOne({
    'name': name,
    'time.day': day,
    'title': title
  },callback);
}

exports.update = function(name, day, title, post, callback){
  Post.update({
    'name': name,
    'time.day': day,
    'title': title
  },{
    'post': post
  },callback);
}

exports.remove = function(name, day, title, callback){
  Post.remove({
    'name': name,
    'time.day': day,
    'title': title
  }, callback);
};

exports.newAndSave = function(name, title, post, callback) {
  var p = new Post();
  p.name = name;
  p.title = title;
  p.post = post;
  
  var date = new Date();
  var time = {
    date: date,
    year: date.getFullYear(),
    month: date.getFullYear() + '-' + (date.getMonth() + 1),
    day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
  }
  p.time = time;
  p.save(callback);
}