import { ConditionStrategy } from './condition-strategy';
import { Device, Rule, RuleCondition, DeviceState, TemperatureRuleCondition } from '@ioatt/types';

export class TemperatureConditionService implements ConditionStrategy {
  public match (condition: RuleCondition): boolean {
    return condition.type === 'temperature';
  }

  public state (rule: Rule, condition: TemperatureRuleCondition): boolean {
    return true;
  }
}
