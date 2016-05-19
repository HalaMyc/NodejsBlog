var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../proxy').User;
var Post = require('../proxy').Post;
var eventproxy = require('eventproxy');



/* GET home page. */
router.get('/', function(req, res) {
  Post.getAllPost(function(err, posts){
    if(err){
      posts = [];
    }
    console.log(req.session.user);
    if(req.session.user){
      res.render('index', {
      title: '主页',
      user: req.session.user,
      posts: posts 
      });
    }else{
      res.render('index',{
      title:'主页',
      posts: posts
    });
    }
  });
});

router.get('/reg', function(req, res) {
  res.render('reg', { title: '注册'});  
});

router.post('/reg', function(req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    var password_re = req.body['password-repat'];
    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function(msg) {
      res.status(422);
      res.render('reg', {error: msg});
    });
    if(password_re != password){
      ep.emit('prop_err', '两次输入的密码不一致');
      return;
    }
    var md5 = crypto.createHash('md5');
      password = md5.update(password).digest('hex');
    User.getUserByName(name, function(err, user) {
      console.log(user);
      if(user){
        return ep.emit('prop_err', '该用户已存在');
      }
      User.newAndSave(name,password,function(err){
        if(err){
          return next(err);
        }
        console.log('success');
        req.session.user = user;
        res.redirect('/');
      });
    });
});

router.get('/login', function(req, res ){
  res.render('login', { title: '登录'});
});

router.post('/login', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  var ep = new eventproxy();
  ep.fail(next);
  ep.on('login_err', function(msg){
    res.status(422);
    res.render('login', {error: msg});
  });
  User.getUserByName(name, function(err, user) {
    if(!user){
      return ep.emit('login_err', '改用户不存在');
    }
    var md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');
    if(password != user.password){
      return ep.emit('login_err', '密码错误');
    }
    req.session.user = user;
    res.redirect('/');
  });
});

router.get('/post', function(req, res) {
  res.render('post', {
    title: '发表'
  });
});

router.post('/post', function(req, res, next) {
  var currentUser = req.session.user;
  Post.newAndSave(currentUser.name, req.body.title, req.body.post, function(err) {
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

router.get('u/:name', function(req, res){
  User.getUserByName(req.params.name, function(err, user){
    if(!user){
      res.redirect('/');
      return;
    }
    Post.getUserByName(user.name, function (err, posts) {
      res.redirect('/', {
        title: user.name,
        posts: posts,
        user: user
      });
    })
  });
});

router.get('/u/:name/:day/:title', function(req, res){
  console.log(req.params.day);
  Post.getPostOne(req.params.name, req.params.day, req.params.title, function(err, post){
    console.log(err);
    if(err){
      return res.redirect('/');
    }
    console.log(post);
    res.render('article', {
      title: post.title,
      post: post,
      user: req.session.user
    });
  });
});

router.get('/edit/:name/:day/:title', function(req, res){
  console.log(req.params.day);
  Post.getPostOne(req.params.name, req.params.day, req.params.title, function(err, post){
    if(err){
      return res.redirect('/');
    }
    return res.render('edit', {
      title: post.title,
      post: post,
      user: req.session.user
    });
  });
});

router.post('/edit/:name/:day/:title', function(req, res){
  Post.update(req.params.name, req.params.day, req.params.title, req.body.post, function(err){
    if(err){
      return res.redirect('/');
    }
    var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
    return res.redirect(url);
  })
});

router.get('/remove/:name/:day/:title', function(req, res) {
  Post.remove(req.params.name, req.params.day, req.params.title, function(err){
    return res.redirect('/');
  });
})

module.exports = router;
