import { ConditionStrategy } from './condition-strategy';
import { Device, Rule, RuleCondition, DeviceState } from '@ioatt/types';

export class WeekdayConditionService implements ConditionStrategy {
  public match (condition: RuleCondition): boolean {
    return condition.type === 'weekDay';
  }

  public state (rule: Rule, condition: RuleCondition): boolean {
    return true;
  }
}
