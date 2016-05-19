var mongoose = require('mongoose');

var postShema = mongoose.Schema({
  name: String,
  title: String,
  post: String,
  time: Object
});
mongoose.model('Post', postShema);