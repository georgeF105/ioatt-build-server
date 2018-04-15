import * as admin from 'firebase-admin';
import { appOptions } from './firebase.config';
import { Device, Rule, Sensor, SensorData } from '@ioatt/types';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export const SENSORS_REF = 'sensors';
export const DEVICES_REF = 'devices';

export class FirebaseAdminService {
  private database: admin.database.Database;
  private _rulesSubject: ReplaySubject<Rule[]>;
  private _sensorsSubject: ReplaySubject<Sensor[]>;
  private _deviceSubject: { [name: string]: ReplaySubject<Device> } = {};
  private _sensorSubject: { [name: string]: ReplaySubject<Sensor> } = {};

  constructor () {
    admin.initializeApp(appOptions);
    this.database = admin.database();
  }

  public getDeviceStatus (deviceName: string): Promise<any> {
    return this.database.ref(DEVICES_REF).child(deviceName).once('value')
      .then(snapshot => {
        const { state } = snapshot.val();
        return { boolState: state };
      });
  }

  public updateDeviceState (deviceName: string, state: boolean | number): void {
    this.database.ref(DEVICES_REF).child(deviceName).child('state').set(state);
  }

  public pushSensorUpdate (deviceName: string, data: any): Promise<any> {
    this.updateDeviceLastComDate(deviceName);
    return this.database.ref(DEVICES_REF).child(deviceName).once('value').then(snapshot => {
      const { sensor } = snapshot.val(); ;
      return this.database.ref('sensors').child(sensor).child('data').push().set(data);
    });
  }

  public getDevice (deviceName: string): Observable<Device> {
    if (!this._deviceSubject[deviceName]) {
      this._deviceSubject[deviceName] = new ReplaySubject<Device>(1);
      const ref = this.database.ref(DEVICES_REF).child(deviceName);
      ref.on('value', value => {
        const device: Device = value.val();
        this._deviceSubject[deviceName].next(device);
      });
    }

    return this._deviceSubject[deviceName];
  }

  public getRules (): Observable<Rule[]> {
    if (!this._rulesSubject) {
      this._rulesSubject = new ReplaySubject<Rule[]>(1);

      const ref = this.database.ref('rules');
      ref.on('value', snapshot => {
        const value = snapshot.val();

        const rules: Rule[] = Object.keys(value)
          .map(key => {
            return {
              ...value[key],
              key: key
            };
          });
        this._rulesSubject.next(rules);
      });
    }

    return this._rulesSubject;
  }

  public updateSensorData (sensorName: string, data: SensorData): void {
    this.database.ref(SENSORS_REF).child(sensorName).child('data').set(data);
    this.database.ref(SENSORS_REF).child(sensorName).child('lastUpdated').set(admin.database.ServerValue.TIMESTAMP);
  }

  public getSensors (): Observable<Sensor[]> {
    if (!this._sensorsSubject) {
      this._sensorsSubject = new ReplaySubject<Sensor[]>(1);

      const ref = this.database.ref(SENSORS_REF);
      ref.on('value', snapshot => {
        const value = snapshot.val();

        const sensors: Sensor[] = Object.keys(value)
          .map(key => {
            return {
              ...value[key],
              key: key
            };
          });
        this._sensorsSubject.next(sensors);
      });
    }

    return this._sensorsSubject;
  }

  public getSensor (sensorName: string): Observable<Sensor> {
    if (!this._sensorSubject[sensorName]) {
      this._sensorSubject[sensorName] = new ReplaySubject<Sensor>(1);
      const ref = this.database.ref('sensors').child(sensorName);
      ref.on('value', value => {
        const sensor: Sensor = value.val();
        this._sensorSubject[sensorName].next(sensor);
      });
    }

    return this._sensorSubject[sensorName];
  }

  public updateRuleLastUpdatedTime (rule: Rule): void {
    this.database.ref('rules').child(rule.key).child('lastUpdated').set(admin.database.ServerValue.TIMESTAMP);
  }

  private updateDeviceLastComDate (deviceName: string): void {
    this.database.ref(DEVICES_REF).child(deviceName).child('lastComDate').set(admin.database.ServerValue.TIMESTAMP);
  }
}
