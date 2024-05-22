import {ConfigT as BaseConfigT} from './config';
import {AnyPipelineRule} from './rules/generated-types';

type ConfigT = Omit<BaseConfigT, 'pipeline'> | {
    pipeline: Array<AnyPipelineRule>;
};

export {AnyPipelineRule};