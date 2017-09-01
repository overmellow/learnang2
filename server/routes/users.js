var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find(function(err, users) {
    if (err) throw err;
    	res.json(users)
  });
})

.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) throw err;
  		res.json(user)
  });
})

.post('/', function(req, res, next) {
  var newUser = new User({
  	userId: req.body.userId,
  	name: req.body.name,
  	email: req.body.email
  })

  newUser.save(function(err, newuser){
  	res.json(newuser);
  })
})

.put('/:id', function(req, res, next) {
  User.findOne({_id: req.params.id}, function(err, user) {
    if (err) throw err;

		user.name = req.body.name,
		user.password = req.body.password,
		user.email =  req.body.email,
		user.save(function(err, updateduser){
  		res.json(updateduser);
  	});
  });
})

.delete('/:id', function(req, res, next) {
  User.remove({_id: req.params.id}, function(err) {
    if (err) throw err;

  	res.send(200);
	});
});

/* GET users listing. */
router.get('/find/:searchName', function(req, res, next) {
  var searchterm = req.params.searchName;
  console.log(searchterm)
  User.find({"name": { "$regex": searchterm, "$options": "i" }, '_id': {'$ne': req.decoded._id}}).select('_id name email').exec(function(err, users) {
    if (err) throw err;
    	res.json(users)
  });
})

module.exports = router;
