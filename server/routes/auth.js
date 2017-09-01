var express = require('express');
var router = express.Router();

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file

//var codeAuth = require('code-auth');

var User = require('../models/user');

router
.post('/signin', function(req, res) {

  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (user) {

      if(user.password == req.body.password){
        //res.send(200)
        var token = jwt.sign(user, config.secret, {
          //expiresIn: 1440, // expires in 24 hours
        });
        res.json({
          success: true,
          token: token,
          user: {id: user._id, name: user.name, email: user.email}
        });
      } else{
        res.status(403).send('Authentication failed. Unmatched name and password.')
      }
    }
    else {
       res.status(401).send('Authentication failed. Wrong name.');
    }
  });
})

.post('/signup', function(req, res, next) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {

      var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })

      newUser.save(function(err, newuser){
        res.json(newuser);
      })
    } else {
      res.status(401).send('Email is registered.');
    }
  });
})

module.exports = router;
