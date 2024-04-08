import {PathItemObject} from "../openapi-models";

export const findParameterIndex = (parameters: PathItemObject['parameters'], parameterName: string, parameterIn: string): number | null => {
    const index = parameters?.findIndex((parameter) => {
        return 'name' in parameter && parameter.name === parameterName && parameter.in === parameterIn;
    });

    return index !== -1 && typeof index === 'number' ? index : null;
};