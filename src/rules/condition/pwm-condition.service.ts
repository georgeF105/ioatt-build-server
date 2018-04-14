import { ConditionStrategy } from './condition-strategy';
import { Device, Rule, RuleCondition, DeviceState } from '@ioatt/types';

export class PWMConditionService implements ConditionStrategy {
  public match (condition: RuleCondition): boolean {
    return condition.type === 'pwmValue';
  }

  public state (rule: Rule, condition: RuleCondition): number {
    return 123;
  }
}
