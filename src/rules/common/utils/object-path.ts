import {messagesFactory} from "../../../logger/messages/factory";

export const getPathKeys = (
    path: string | Array<string> | undefined
): Array<string> => {
    if (!path) {
        return [];
    }

    const rawPathKeys = Array.isArray(path) ? path : path.split(/[.\[\]]/);

    return rawPathKeys.filter(key => !!key);
}

const normalizePathForLogging = (
    path: string | Array<string> | undefined
): string => {
    if (!path) {
        return '';
    }

    return Array.isArray(path) ? path.join('.') : path
}


export const getObjectPath = <SourceObject = any, Value = any>(
    sourceObject: SourceObject,
    path: string | Array<string> | undefined,
    sourcePath = path,
): Value => {
    const pathKeys = getPathKeys(path);
    if (!pathKeys?.length) {
        throw new Error('Not valid path');
    }

    // @ts-expect-error
    let resultObject = sourceObject[pathKeys[0]];
    if (resultObject === undefined) {
        if (sourceObject && typeof sourceObject  === 'object' && '$ref' in sourceObject) {
            throw new Error(
                messagesFactory.failedToResolvePath.conflictRef(
                    normalizePathForLogging(sourcePath),
                    sourceObject,
                    normalizePathForLogging(path),
                ),
            );
        }

        if (sourceObject && typeof sourceObject  === 'object' && 'allOf' in sourceObject) {
            throw new Error(
                messagesFactory.failedToResolvePath.conflictAllOf(
                    normalizePathForLogging(sourcePath),
                    sourceObject,
                    normalizePathForLogging(path),
                ),
            );
        }

        if (sourceObject && typeof sourceObject  === 'object' && 'anyOf' in sourceObject) {
            throw new Error(
                messagesFactory.failedToResolvePath.conflictAnyOf(
                    normalizePathForLogging(sourcePath),
                    sourceObject,
                    normalizePathForLogging(path),
                ),
            );
        }

        if (sourceObject && typeof sourceObject  === 'object' && 'oneOf' in sourceObject) {
            throw new Error(
                messagesFactory.failedToResolvePath.conflictOneOf(
                    normalizePathForLogging(sourcePath),
                    sourceObject,
                    normalizePathForLogging(path),
                ),
            );
        }
    }

    if (sourceObject && pathKeys.length > 1) {
        return getObjectPath(resultObject, pathKeys.slice(1), path);
    }

    return resultObject;
}

export const setObjectProp = <SourceObject = any, Value = any>(
    sourceObject: SourceObject,
    path: string | Array<string> | undefined,
    value: Value,
): void => {
    const pathKeys = getPathKeys(path);
    if (!pathKeys?.length) {
        throw new Error('Not valid path');
    }

    if (pathKeys.length > 1) {
        // @ts-expect-error
        if (!sourceObject[pathKeys[0]]) {
            throw new Error('Not valid path');
        }

        // @ts-expect-error
        return setObjectProp(sourceObject[pathKeys[0]], pathKeys.slice(1), value);
    }

    if (pathKeys[0]) {
        // @ts-expect-error
        sourceObject[pathKeys[0]] = value;
    }
}
