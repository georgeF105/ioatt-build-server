import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import 'dotenv/config';

import firmware from './routes/firmware/firmware.route';
import { SensorRoute } from './routes/sensor/sensor.route';
import { DeviceStatusRoute } from './routes/device-status/device-status.route';
import { FirebaseAdminService } from './services/firebase/firebase-admin.service';

import { RulesService } from './rules/rules.service';
import { PWMConditionService } from './rules/condition/pwm-condition.service';
import { TemperatureConditionService } from './rules/condition/temperature-condition.service';
import { TimeConditionService } from './rules/condition/time-condition.service';
import { WeekdayConditionService } from './rules/condition/weekday-condition.service';

const firebaseAdminService = new FirebaseAdminService();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const sensorRoute = new SensorRoute(firebaseAdminService);
const deviceStatusRoute = new DeviceStatusRoute(firebaseAdminService);

app.use('/firmware', firmware);
app.use('/sensor', sensorRoute.router);
app.use('/deviceStatus', deviceStatusRoute.router);

const rulesService = new RulesService(firebaseAdminService, [
  new PWMConditionService(),
  new TemperatureConditionService(),
  new TimeConditionService(),
  new WeekdayConditionService()
]);

export = app;
