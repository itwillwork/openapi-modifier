import {OpenAPIFileT} from "../../../../openapi";
import {LoggerI} from "../../../../logger/interface";
import {messagesFactory} from "../../../../logger/messages/factory";

const ROOT_ARRAY_PLACEHOLDER = '[]';

const checkIsArray = (rawPart: string | null): boolean => {
    return !!rawPart && /\[\]$/.test(rawPart);
}

const clearArrayPostfix = (rawPart: string): string => rawPart.replace(/\[\]$/, '');

type ParsedSimpleDescriptor = {
    name: string | null;
    correction?: string;
}

type AnyOpenAPISchema = any;

const checkIsExistField = (
    rootSchema: AnyOpenAPISchema,
    field: string,
): boolean => {
    return !!rootSchema[field];
}

export const parseSimpleDescriptor = (
    descriptor: string | null | undefined,
    options: { isContainsName?: boolean },
    logger: LoggerI,
    rootSchema?: AnyOpenAPISchema | null | undefined,
): ParsedSimpleDescriptor | null => {
    if (!descriptor) {
        logger.warning(messagesFactory.descriptor.failedToParse(descriptor, 'Empty value'));
        return null;
    }

    const clearDescriptor = descriptor.trim();
    if (!clearDescriptor) {
        logger.warning(messagesFactory.descriptor.failedToParse(descriptor, 'Empty value'));
        return null;
    }

    const parts = clearDescriptor.split('.').map(value => {
        return value.trim();
    }).filter(value => !!value);

    if (!parts?.length) {
        logger.warning(messagesFactory.descriptor.failedToParse(descriptor));
        return null;
    }

    const rawComponentName = options?.isContainsName ? parts[0] : null;
    const componentName = rawComponentName ? clearArrayPostfix(rawComponentName) : null;
    if (
        options?.isContainsName &&
        rootSchema &&
        componentName &&
        !checkIsExistField(rootSchema, componentName)
    ) {
        logger.warning(messagesFactory.descriptor.failedToResolveDescriptor(descriptor));
        return null;
    }

    const rawParts = options?.isContainsName ? parts.slice(1) : parts;

    let baseSchema = rootSchema;
    const correctionParts: Array<string> = []
    if (checkIsArray(rawComponentName)) {
        if (baseSchema) {
            if (checkIsExistField(baseSchema, 'items')) {
                baseSchema = baseSchema?.items;
                correctionParts.push('items');
            } else {
                throw new Error();
            }
        } else {
            correctionParts.push('items');
        }
    }

    rawParts.forEach((rawPart) => {
        if (ROOT_ARRAY_PLACEHOLDER !== rawPart) {
            if (baseSchema) {
                if (checkIsExistField(baseSchema, 'properties')) {
                    baseSchema = baseSchema?.properties;
                    correctionParts.push('properties');
                } else {
                    throw new Error();
                }
            } else {
                correctionParts.push('properties');
            }
        }

        if (checkIsArray(rawPart)) {
            if (ROOT_ARRAY_PLACEHOLDER !== rawPart) {
                correctionParts.push(clearArrayPostfix(rawPart));
            }

            correctionParts.push('items');
        } else {
            correctionParts.push(rawPart);
        }
    });

    const correction = correctionParts.join('.');

    return {
        name: componentName,
        correction: correction || undefined,
    }
}