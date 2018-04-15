import { ConditionStrategy } from './condition-strategy';
import { Device, Rule, RuleCondition, DeviceState, TemperatureRuleCondition } from '@ioatt/types';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

export class TemperatureConditionService implements ConditionStrategy {
  public match (condition: RuleCondition): boolean {
    return condition.type === 'temperature';
  }

  public state (rule: Rule, condition: TemperatureRuleCondition): Observable<boolean> {
    return of(true);
  }
}
