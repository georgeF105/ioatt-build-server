import { FirebaseAdminService } from '../services/firebase/firebase-admin.service';
import { sampleTime, map, switchMap, reduce, timeInterval, tap, mergeMap, filter } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { Sensor, SensorData } from '@ioatt/types';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
// tslint:disable-next-line:no-var-requires
let netatmo = require('netatmo');

export const SENSORS_REF = 'sensors';
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 min

export class SensorsService {
  constructor (
    private firebaseAdminService: FirebaseAdminService
  ) {
    this.attachSubscriptions();
  }

  private attachSubscriptions(): void {
    this.firebaseAdminService.getSensors().pipe(
      sampleTime(UPDATE_INTERVAL),
      switchMap(sensors => from(sensors).pipe(
        filter(sensor => sensor.type === 'netatmo'),
        mergeMap(sensor => this.getSensorData(sensor).pipe(map(data => ({sensor, data}))))
      ))
    ).subscribe(({sensor, data}) => {
      console.log('updating sensor', sensor, 'to', data);
      this.firebaseAdminService.updateSensorData(sensor.key, data);
    });
  }

  private getSensorData (sensor: Sensor): Observable<SensorData> {
    let api = new netatmo((<any>sensor).auth);
    const resultSubject = new Subject<SensorData>();
    api.getStationsData((err, devices) => {
      if (!devices || err) {
        resultSubject.error(err);
      }
      resultSubject.next(devices[0].dashboard_data);
    });
    return resultSubject;
  }
}
