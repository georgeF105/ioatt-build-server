import { Router }  from 'express';
import { FirebaseAdminService } from '../../services/firebase/firebase-admin.service';
let router = Router();

export class DeviceStatusRoute {
  public router: Router;

  constructor (
    private firebaseAdminService: FirebaseAdminService
  ) {
    this.router = Router();

    this.router.get('/', (req, res, next) => this.getSensorData(req, res, next));
  }

  private getSensorData (req, res, next) {
    const deviceKey = req.headers['devicekey'];

    console.log(deviceKey);
    this.firebaseAdminService.getDeviceStatus(deviceKey)
      .then(state => {
        console.log('deviceState', state);
        res.send(state);
      });
  }
}
