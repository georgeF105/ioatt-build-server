import * as express from 'express';
import { FirebaseAdminService } from '../../services/firebase/firebase-admin.service';
let router = express.Router();

const firebaseAdminService = new FirebaseAdminService();

/* GET home page. */
router.post('/', function(req, res, next) {
  const data = req.body;
  console.log(data);
  firebaseAdminService.pushSensorUpdate('D1_MINI_01', data);
  res.send();
});

export default router;
