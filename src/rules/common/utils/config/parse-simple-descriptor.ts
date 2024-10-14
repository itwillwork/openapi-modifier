const ROOT_ARRAY_PLACEHOLDER = '[]';

const checkIsArray = (rawPart: string | null): boolean => {
    return !!rawPart && /\[\]$/.test(rawPart);
}

const checkIsOneOff = (rawPart: string | null): boolean => {
    if (!rawPart) {
        return false;
    }

    return /^oneOf\[\d+\]$/.test(rawPart);
}

const checkIsAllOf = (rawPart: string | null): boolean => {
    if (!rawPart) {
        return false;
    }

    return /^allOf\[\d+\]$/.test(rawPart);
}

const checkIsAnyOf = (rawPart: string | null): boolean => {
    if (!rawPart) {
        return false;
    }

    return /^anyOf\[\d+\]$/.test(rawPart);
}

const clearArrayPostfix = (rawPart: string): string => rawPart.replace(/\[\]$/, '');

type ParsedSimpleDescriptor = {
    name: string | null;
    correction?: string;
}

export const parseSimpleDescriptor = (descriptor: string | null | undefined, options?: { isContainsName?: boolean }): ParsedSimpleDescriptor | null => {
    if (!descriptor) {
        return null;
    }

    const clearDescriptor = descriptor.trim();
    if (!clearDescriptor) {
        return null;
    }

    const parts = clearDescriptor.split('.').map(value => {
        return value.trim();
    }).filter(value => !!value);

    if (!parts?.length) {
        return null;
    }

    const rawComponentName = options?.isContainsName ? parts[0] : null;
    const rawCorrection = options?.isContainsName ? parts.slice(1) : parts;

    const correctionParts = rawCorrection.reduce<string[]>((acc, rawPart) => {
        if (checkIsOneOff(rawPart) || checkIsAllOf(rawPart) || checkIsAnyOf(rawPart)) {
            acc.push(rawPart);
            return acc;
        }

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