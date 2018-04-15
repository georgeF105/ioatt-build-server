import { Device, DeviceState, RuleCondition, Rule } from '@ioatt/types';
import { Observable } from 'rxjs/Observable';

export interface ConditionStrategy {
  match: (condition: RuleCondition) => boolean;
  state: (rule: Rule, condition: RuleCondition) => Observable<boolean | number>;
}
