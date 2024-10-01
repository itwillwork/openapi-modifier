import {z} from 'zod';
import {anyComponentWithCorrectionDescriptorConfigSchema} from "../../config";
import {LoggerI} from "../../../../logger/interface";
import {parseSimpleDescriptor} from "./parse-simple-descriptor";

export type ParsedComponentWithCorrectionDescriptor = {
    componentName: string;
    correction?: string;
}

export const parseSimpleComponentWithCorrectionDescriptor = (
    componentDescriptor: z.infer<typeof anyComponentWithCorrectionDescriptorConfigSchema>,
): ParsedComponentWithCorrectionDescriptor | null => {
    if (typeof componentDescriptor === 'string') {
        const parsedSimpleDescriptor = parseSimpleDescriptor(componentDescriptor, { isContainsName: true });
        if (!parsedSimpleDescriptor) {
            return null;
        }

        const { name, correction } = parsedSimpleDescriptor;
        if (!name) {
            return null;
        }

        return {
            componentName: name,
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