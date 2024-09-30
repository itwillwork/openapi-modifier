import {z} from 'zod';
import {anyComponentWithCorrectionDescriptorConfigSchema} from "../../config";
import {LoggerI} from "../../../../logger/interface";

export type ParsedComponentWithCorrectionDescriptor = {
    componentName: string;
    correction?: string;
}

export const parseSimpleComponentWithCorrectionDescriptor = (
    componentDescriptor: z.infer<typeof anyComponentWithCorrectionDescriptorConfigSchema>,
): ParsedComponentWithCorrectionDescriptor | null => {
    if (typeof componentDescriptor === 'string') {
        const checkIsArray = (rawPart: string): boolean => /\[\]$/.test(rawPart);
        const clearArrayPostfix = (rawPart: string): string => rawPart.replace(/\[\]$/, '');

        const clearComponentDescriptor = componentDescriptor.trim();
        if (!clearComponentDescriptor) {
            return null;
        }

        const parts = clearComponentDescriptor.split('.').map(value => {
            return value.trim();
        }).filter(value => !!value);

        if (!parts?.length) {
            return null;
        }

        const rawComponentName = parts[0];
        const rawCorrection = parts.slice(1);

        const componentName = clearArrayPostfix(rawComponentName);
        const correctionParts = rawCorrection.reduce<string[]>((acc, rawPart) => {
            acc.push('properties');
            if (checkIsArray(rawPart)) {
                acc.push(clearArrayPostfix(rawPart));
                acc.push('items');
            } else {
                acc.push(rawPart);
            }

            return acc;
        }, checkIsArray(rawComponentName) ? ['items'] : []);

        const correction = correctionParts.join('.');
        return {
            componentName,
            correction: correction || undefined,
        }
    }

    return null;
}

export const parseAnyComponentWithCorrectionDescriptor = (
    componentDescriptor: z.infer<typeof anyComponentWithCorrectionDescriptorConfigSchema>,
    logger: LoggerI,
): ParsedComponentWithCorrectionDescriptor | null => {
    if (typeof componentDescriptor === "object" && "componentName" in componentDescriptor) {
        return componentDescriptor;
    }


    if (typeof componentDescriptor === 'string') {
        const parsedComponentDescriptor = parseSimpleComponentWithCorrectionDescriptor(componentDescriptor);
        if (!parsedComponentDescriptor) {
            logger.errorMessage(`
                Failed to parse component descriptor: "${componentDescriptor}". 
                Use format: "{componentName}.{path}", for example: "TestDto.foo.bar[].test"
            `);
            return null;
        }

        return parsedComponentDescriptor;
    }

    logger.errorMessage(`Wrong component descriptor: ${JSON.stringify(componentDescriptor)}`);
    return null;
}