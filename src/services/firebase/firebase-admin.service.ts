import * as admin from 'firebase-admin';
import { appOptions } from './firebase.config';

export class FirebaseAdminService {
  private database: admin.database.Database;
  constructor () {
    admin.initializeApp(appOptions);
    this.database = admin.database();
  }

  public pushSensorUpdate (deviceName: string, data: any): Promise<any> {
    return this.database.ref('devices').child(deviceName).once('value').then(snapshot => {
      const { sensor } = snapshot.val(); ;
      return this.database.ref('sensors').child(sensor).child('data').push().set(data);
    });
  }
}
