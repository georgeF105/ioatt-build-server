import { FirebaseAdminService } from '../services/firebase/firebase-admin.service';
import { sampleTime, map } from 'rxjs/operators';
import { Rule, RuleCondition } from '@ioatt/types';
import { ConditionStrategy } from './condition/condition-strategy';

const UPDATE_INTERVAL = 10000;
export class RulesService {
  constructor (
    private firebaseAdminService: FirebaseAdminService,
    private conditionStrategies: ConditionStrategy[]
  ) {
    this.attachSubscriptions();
  }

  private attachSubscriptions (): void {
    this.firebaseAdminService.getRules().pipe(
      sampleTime(UPDATE_INTERVAL),
      map(rules => {
        console.log('RULES', rules);
        return rules.map(rule => ({ rule, state: this.getRuleState(rule)}));
      })
    ).subscribe(deviceStates => {
      deviceStates.forEach(deviceState => {
        const { rule, state } = deviceState;
        const deviceName = rule.linkedDeviceKey;
        console.log('updating device', deviceName, 'to', state);
        // this.firebaseAdminService.updateDeviceState(deviceName, state);
      });
    });
  }

  public getRuleState (rule: Rule): number | boolean {
    const state = rule.conditions.reduce((acc, condition) => {
      const conditionService = this.getConditionService(condition);
      switch (condition.logicOperator) {
        case 'and':
          return acc && conditionService.state(rule, condition);
        case 'or':
          return acc || conditionService.state(rule, condition);
        case 'xand':
          return acc && !conditionService.state(rule, condition);
        case 'xor':
          return acc || !conditionService.state(rule, condition);
        default:
          return true;
      }
    },                                   true);
    return state;
  }

  private getConditionService (condition: RuleCondition): ConditionStrategy {
    return this.conditionStrategies.find(strategy => strategy.match(condition))
      || { state: () => false, match: () => true };
  }
}
