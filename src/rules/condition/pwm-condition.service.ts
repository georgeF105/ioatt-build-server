import { ConditionStrategy } from './condition-strategy';
import { Device, Rule, RuleCondition, DeviceState, PWMValueCondition } from '@ioatt/types';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { FirebaseAdminService } from '../../services/firebase/firebase-admin.service';
import { map, take, tap } from 'rxjs/operators';

export class PWMConditionService implements ConditionStrategy {
  constructor (
    private firebaseAdminService: FirebaseAdminService
  ) {}
  public match (condition: RuleCondition): boolean {
    return condition.type === 'pwmValue';
  }

  public state (rule: Rule, condition: PWMValueCondition): Observable<number> {
    const now = new Date();
    const intervalTime = +(new Date()) - rule.lastUpdated;
    const increaseRate = intervalTime * (condition.maxValue / condition.timeToMax);
    return this.firebaseAdminService.getDevice(rule.linkedDeviceKey).pipe(
      take(1),
      map(device => Math.min(+device.state + increaseRate, condition.maxValue))
    );
  }
}
