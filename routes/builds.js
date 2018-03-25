var express = require('express');
var router = express.Router();
var path = require('path');
const gh = require('ghreleases');

const https = require('https');
const fs = require('fs');
const request = require('request');

let currentVersion = '0.0.2';

let devMode = true;
let lastUpdated = Date.now();
const minUpdateTime = 30000;

/* GET builds. */
router.get('/test', function(req, res, next) {
  console.log('test headers', req.headers);
  res.send('respond with a resource');
});

/* GET builds. */
router.get('/:type', function(req, res, next) {
  let type = req.params.type;
  let deviceVersion = req.headers['x-esp8266-version'];
  console.log('deviceVersion:', deviceVersion);
  console.log('HEADERS:', req.headers);

  const auth = {
    user: 'georgeF105',
    token: '80588d9fa6b7d827eb5143465a2da7b707308db7'
  };

  if (!devMode) {
    gh.getLatest(auth, 'georgeF105', 'ioatt-device', (err, release) => {
      if (err) {
        res.status(500).send(err);
        console.log('err', err);
        return;
      }
  
      const { tag_name, assets } = release;
      console.log('tag_name', tag_name);
      console.log('release', release);
          
      if (deviceVersion === tag_name || true) {
        console.log('update not needed!');
        res.status(304).send('update not needed');
        return;
      }
  
      const asset = (assets || []).find(a => a.name === type);
  
      if (!asset) {
        res.status(404).send(`Type ${type} not found`);
        return;
      }
  
      // var file = fs.createWriteStream(type);
      // const fileReq = https.request(asset.browser_download_url, response => {
      //   console.log('Sending update');
      //   res.setHeader('content-disposition', `attachment; filename=${type}`);
      //   res.setHeader('content-length', asset.size);
      //   response.pipe(res);
      // });
      // fileReq.end();
  
      
  
  
      res.setHeader('content-disposition', `attachment; filename=${type}`);
      res.setHeader('content-length', asset.size);
      request(asset.browser_download_url).pipe(res);
    }); 
  } else {
    if (lastUpdated + minUpdateTime > Date.now()) {
      console.log('update not needed!');
      res.status(304).send('update not needed');
    } else {
      let _path = path.join(__dirname, '../../device', '.pioenvs', 'd1_mini', 'firmware.bin');
      console.log('updating to', _path);
      res.sendFile(_path);
    }
  }
   
});

module.exports = router;
