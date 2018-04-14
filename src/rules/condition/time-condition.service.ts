import { ConditionStrategy } from './condition-strategy';
import { Device, Rule, RuleCondition, DeviceState, TimeRuleCondition } from '@ioatt/types';
import * as moment from 'moment';

export class TimeConditionService implements ConditionStrategy {
  public match (condition: RuleCondition): boolean {
    return condition.type === 'time';
  }

  public state (rule: Rule, condition: TimeRuleCondition): boolean {
    const startTime = this.getDateFromTime(condition.startTime);
    const endTime = this.getDateFromTime(condition.endTime);
    return moment().isBetween(this.getDateFromTime(condition.startTime), this.getDateFromTime(condition.endTime));
  }

  private getDateFromTime (time: string): Date {
    let timeArr = time.split(':');
    let date = new Date();
    date.setHours(parseInt(timeArr[0]));
    date.setMinutes(parseInt(timeArr[1]));
    return date;
  }
}
