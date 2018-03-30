import * as express from 'express';
let router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log(req.body);
  res.send();
});

export default router;