import { ConditionStrategy } from './condition-strategy';
import { Device, Rule, RuleCondition, DeviceState } from '@ioatt/types';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

export class WeekdayConditionService implements ConditionStrategy {
  public match (condition: RuleCondition): boolean {
    return condition.type === 'weekDay';
  }

  public state (rule: Rule, condition: RuleCondition): Observable<boolean> {
    return of(true);
  }
}
