import * as admin from 'firebase-admin';
import { appOptions } from './firebase.config';
import { Device, Rule } from '@ioatt/types';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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

  public updateDeviceState (deviceName: string, state: boolean | number): void {
    this.database.ref('devices').child(deviceName).child('state').set(state);
  }

  public pushSensorUpdate (deviceName: string, data: any): Promise<any> {
    this.updateDeviceLastComDate(deviceName);
    return this.database.ref('devices').child(deviceName).once('value').then(snapshot => {
      const { sensor } = snapshot.val(); ;
      return this.database.ref('sensors').child(sensor).child('data').push().set(data);
    });
  }

  public getDevice (deviceName: string): Observable<Device> {
    const deviceSubject = new Subject<Device>();

    const ref = this.database.ref('devices').child(deviceName);
    ref.on('value', value => {
      const device: Device = value.val();
      deviceSubject.next(device);
    });

    return deviceSubject.asObservable();
  }

  public getRules (): Observable<Rule[]> {
    const rulesSubject = new Subject<Rule[]>();

    const ref = this.database.ref('rules');
    ref.on('value', snapshot => {
      const value = snapshot.val();

      const rules: Rule[] = Object.keys(value)
        .map(key => {
          return value[key];
        });
      rulesSubject.next(rules);
    });

    return rulesSubject.asObservable();
  }

  private updateDeviceLastComDate (deviceName: string): void {
    this.database.ref('devices').child(deviceName).child('lastComDate').set(admin.database.ServerValue.TIMESTAMP);
  }
}
