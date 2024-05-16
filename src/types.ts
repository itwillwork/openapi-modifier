import {ConfigT} from './config';

export { ConfigT };

import { RuleConfig as RuleConfig1 } from './rules/change-content-type';
import { RuleConfig as RuleConfig2 } from './rules/change-endpoints-basepath';

type RuleConfig = RuleConfig1 | RuleConfig2;

export { RuleConfig };