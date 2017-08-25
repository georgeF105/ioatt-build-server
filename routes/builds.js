var express = require('express');
var router = express.Router();
var path = require('path');

/* GET builds. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET builds. */
router.get('/fetch/:build', function(req, res, next) {
  let build = req.params.build;
  res.sendFile(path.join(__dirname, '../builds', build, `${build}.bin`));
});

module.exports = router;
