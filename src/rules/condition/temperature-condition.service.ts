import { ConditionStrategy } from './condition-strategy';
import { Device, Rule, RuleCondition, DeviceState, TemperatureRuleCondition } from '@ioatt/types';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { FirebaseAdminService } from '../../services/firebase/firebase-admin.service';
import { map } from 'rxjs/operators';

export class TemperatureConditionService implements ConditionStrategy {
  constructor (
    private firebaseAdminService: FirebaseAdminService
  ) {}

  public match (condition: RuleCondition): boolean {
    return condition.type === 'temperature';
  }

  public state (rule: Rule, condition: TemperatureRuleCondition): Observable<boolean> {
    return this.firebaseAdminService.getSensor(condition.sensorKey).pipe(
      map(sensor => {
        const sensorValue = sensor[condition.sensorDataKey];
        return condition.value > sensorValue;
      })
    );
  }
}
