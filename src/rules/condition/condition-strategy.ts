import { Device, DeviceState, RuleCondition, Rule } from '@ioatt/types';

export interface ConditionStrategy {
  match: (condition: RuleCondition) => boolean;
  state: (rule: Rule, condition: RuleCondition) => boolean | number;
}
