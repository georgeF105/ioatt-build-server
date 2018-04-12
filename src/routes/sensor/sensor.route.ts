import * as express from 'express';
import { FirebaseAdminService } from '../../services/firebase/firebase-admin.service';
let router = express.Router();

export class SensorRoute {
  public router: express.Router;

  constructor (
    private firebaseAdminService: FirebaseAdminService
  ) {
    this.router = express.Router();

    this.router.post('/', (req, res, next) => this.postSensorData(req, res, next));
  }

  private postSensorData (req, res, next) {
    const data = req.body;
    console.log(data);
    this.firebaseAdminService.pushSensorUpdate('D1_MINI_01', data);
    res.send();
  }
}
