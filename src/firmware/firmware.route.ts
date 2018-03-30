import * as express from 'express';
import * as gh from 'ghreleases';
import * as path from 'path';
import * as request from 'request';

let router = express.Router();

const devMode = process.env.mode !== 'prod';

const auth = {
  user: process.env.GH_USER,
  token: process.env.GH_TOKEN
};

let lastUpdated = Date.now();
const minUpdateTime = 30000;

/* GET Firmware */
router.get('/:type', function(req, res, next) {
  let type = req.params.type;
  let deviceVersion = req.headers['x-esp8266-version'];

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

      if (deviceVersion === tag_name) {
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

export default router;
