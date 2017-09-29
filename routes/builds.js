var express = require('express');
var router = express.Router();
var path = require('path');

let currentVersion = '0.0.2';

/* GET builds. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET builds. */
router.get('/fetch/:build', function(req, res, next) {
  let build = req.params.build;
  let deviceVersion = req.headers['x-esp8266-version'];
  console.log('deviceVersion:', deviceVersion);

  if (deviceVersion === currentVersion) {
    console.log('update not needed!');
    res.status(304).send('update not needed');
    return;
  }

  console.log('Sending update');
  res.sendFile(path.join(__dirname, '../builds', build, `${build}.bin`));
});

module.exports = router;
