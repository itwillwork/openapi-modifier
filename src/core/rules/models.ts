import {ConfigSchemaT} from '../config';
import {LoggerI} from "../../logger/interface";
import {OpenAPIFileT} from "../../openapi";
import {ConfigT} from "../../config";

type RulesConfigT = ConfigSchemaT['rules'];
type RuleNameT = keyof RulesConfigT;

export type RuleConfigT<T extends RuleNameT> = RulesConfigT[T];
export type RuleProcessorT<T extends RuleNameT> = (params: {
    logger: LoggerI;
    openAPIFile: OpenAPIFileT;
    config: ConfigT;
}) => Promise<void>;
