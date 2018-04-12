import * as admin from 'firebase-admin';
import { appOptions } from './firebase.config';

export class FirebaseAdminService {
  private database: admin.database.Database;
  constructor () {
    admin.initializeApp(appOptions);
    this.database = admin.database();
  }

  public getDeviceStatus (deviceName: string): Promise<any> {
    return this.database.ref('devices').child(deviceName).once('value')
      .then(snapshot => {
        const { state } = snapshot.val();
        return { boolState: state };
      });
  }

  public pushSensorUpdate (deviceName: string, data: any): Promise<any> {
    this.updateDeviceLastComDate(deviceName);
    return this.database.ref('devices').child(deviceName).once('value').then(snapshot => {
      const { sensor } = snapshot.val(); ;
      return this.database.ref('sensors').child(sensor).child('data').push().set(data);
    });
  }

  private updateDeviceLastComDate (deviceName: string): void {
    this.database.ref('devices').child(deviceName).child('lastComDate').set(admin.database.ServerValue.TIMESTAMP);
  }
}
