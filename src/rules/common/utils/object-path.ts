export const getPathKeys = (
    path: string | Array<string> | undefined
): Array<string> => {
    if (!path) {
        return [];
    }

    const rawPathKeys = Array.isArray(path) ? path : path.split(/[.\[\]]/);

    return rawPathKeys.filter(key => !!key);
}

export const getObjectPath = <SourceObject = any, Value = any>(
    sourceObject: SourceObject,
    path: string | Array<string> | undefined,
): Value => {
    const pathKeys = getPathKeys(path);
    if (!pathKeys?.length) {
        throw new Error('Not valid path');
    }

    // @ts-expect-error
    let resultObject = sourceObject[pathKeys[0]] || null;

    if (sourceObject && pathKeys.length > 1) {
        return getObjectPath(resultObject, pathKeys.slice(1));
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
