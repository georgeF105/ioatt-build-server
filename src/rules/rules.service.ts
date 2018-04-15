import { FirebaseAdminService } from '../services/firebase/firebase-admin.service';
import { sampleTime, map, switchMap, reduce, timeInterval, tap, mergeMap } from 'rxjs/operators';
import { Rule, RuleCondition } from '@ioatt/types';
import { ConditionStrategy } from './condition/condition-strategy';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';

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
      switchMap(rules => from(rules).pipe(
        mergeMap(rule => this.getRuleState(rule).pipe(map(state => ({ rule, state }))))
      ))
    ).subscribe(deviceState => {
      const { rule, state } = deviceState;
      const deviceName = rule.linkedDeviceKey;
      console.log('updating device', deviceName, 'to', state);
      this.firebaseAdminService.updateDeviceState(deviceName, state);
      this.firebaseAdminService.updateRuleLastUpdatedTime(rule);
    });
  }

  public getRuleState (rule: Rule): Observable < number | boolean > {
    return from(rule.conditions).pipe(
        switchMap(condition => {
          return this.getConditionService(condition).state(rule, condition).pipe(
            map(state => ({ condition, state }))
          );
        }),
        reduce((acc: boolean | number, result: { condition: RuleCondition, state: boolean | number }) => {
          const { condition, state } = result;
          switch (condition.logicOperator) {
            case 'and':
              return acc ? state : false;
            case 'or':
              return acc || state;
            case 'xand':
              return acc && !state;
            case 'xor':
              return acc || !state;
            default:
              return false;
          }
        },     true)
      );
  };

  private getConditionService (condition: RuleCondition): ConditionStrategy {
    return this.conditionStrategies.find(strategy => strategy.match(condition))
      || { state: () => of(false), match: () => true };
  }
}
