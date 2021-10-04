var express = require('express');
var router = express.Router();
const User = require('../models/users');



/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({},(req,res) => {
    console.log(User);
  }).then((user) => {
    res.status(201).json(user);
  })
});

//==============Router Post (Add) User=========

router.post('/',function(req, res,next) {
  console.log(req.body);
  
  let user = new User(req.body)
  console.log(user);

  user.save().then((userCreated) => {
    res.status(201).json({userCreated})
  })
})

//===========Router Delete user=============
router.delete('/:id', function(req,res, next) {
  User.findOneAndRemove({_id: req.params.id}).then((userRemove) =>{
    
    res.status(201).json({userRemove})
    console.log('this user remove>',userRemove);
    
  })
})

module.exports = router;
