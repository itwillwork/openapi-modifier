import {checkIsValidConfig, ConfigT, defaultConfig, mergeConfigs} from "./config";
import {ConsoleLogger} from "./logger/console";

export const openapiModifier = (config: Partial<ConfigT>) => {
    const logger = new ConsoleLogger({
        debugPostfix: 'main'
    });

    const finalConfig = mergeConfigs(logger, defaultConfig, config);
    if (!checkIsValidConfig(logger, finalConfig)) {
        return;
    }


    // TODO
}
