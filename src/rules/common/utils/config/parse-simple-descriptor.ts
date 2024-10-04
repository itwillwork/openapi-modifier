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

export const parseSimpleDescriptor = (
    descriptor: string | null | undefined,
    options: { isContainsName?: boolean },
    rootSchema: AnyOpenAPISchema,
    logger: LoggerI,
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
    console.log("parts", parts);

    if (!parts?.length) {
        logger.warning(messagesFactory.descriptor.failedToParse(descriptor));
        return null;
    }

    // kekw
    const rawComponentName = options?.isContainsName ? parts[0] : null;
    const rawCorrection = options?.isContainsName ? parts.slice(1) : parts;

    const correctionParts = rawCorrection.reduce<string[]>((acc, rawPart) => {
        if (ROOT_ARRAY_PLACEHOLDER !== rawPart) {
            acc.push('properties');
        }

        if (checkIsArray(rawPart)) {
            if (ROOT_ARRAY_PLACEHOLDER !== rawPart) {
                acc.push(clearArrayPostfix(rawPart));
            }

            acc.push('items');
        } else {
            acc.push(rawPart);
        }

        return acc;
    }, checkIsArray(rawComponentName) ? ['items'] : []);

    const correction = correctionParts.join('.');

    return {
        name: rawComponentName ? clearArrayPostfix(rawComponentName) : null,
        correction: correction || undefined,
    }
}