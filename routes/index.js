var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uid2 = require('uid2');
var bcrypt = require('bcrypt')

var usersModel = require('../models/users')

const parseDate = strDate => {
  let newStr = strDate.split('/')
    .reverse()
    .join('-');
  let date = new Date(newStr);
  return date;
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//ROUTE SIGN-UP

router.post('/sign-up', async function (req, res, next) {

  const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);

  var result = false

  var findUser = await usersModel.findOne({ email: req.body.emailFromFront })

  if (!findUser) {

    var newUser = new usersModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
      birthday: parseDate(req.body.birthdayFromFront),
      nationality: req.body.nationalityFromFront
    })

    var userSave = await newUser.save()

    if (userSave) {
      result = true
      res.json({ result, token: userSave.token })
    }
  }


  res.json({ result })
});

//ROUTE SIGN-IN

router.post('/sign-in', async function (req, res, next) {

  let findUser = await usersModel.findOne({ email: req.body.emailFromFront })

  if (findUser) {
    let password = req.body.passwordFromFront;

    if (bcrypt.compareSync(password, findUser.password)) {
      res.json({ login: true, token: findUser.token });
    } else {
      res.json({ login: false });
    }
  } 

      res.json({login: false})
});


module.exports = router;
