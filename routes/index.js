var express = require('express');
var router = express.Router();

const userController = require("../controller/user");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/tokensignin', userController.verifyUser);

module.exports = router;
