import {z} from 'zod';
import {anyComponentDescriptorConfigSchema} from "../../config";
import {LoggerI} from "../../../../logger/interface";

export type ParsedComponentDescriptor = {
    componentName: string;
}

export const parseSimpleComponentDescriptor = (
    componentDescriptor: z.infer<typeof anyComponentDescriptorConfigSchema>,
): ParsedComponentDescriptor | null => {
    if (typeof componentDescriptor === 'string') {
        const clearComponentDescriptor = componentDescriptor.trim();
        if (!clearComponentDescriptor) {
            return null;
        }

        return {
            componentName: clearComponentDescriptor,
        }
    }

    return null;
}

export const parseAnyComponentDescriptor = (
    componentDescriptor: z.infer<typeof anyComponentDescriptorConfigSchema>,
    logger: LoggerI,
): ParsedComponentDescriptor | null => {
    if (typeof componentDescriptor === "object" && "componentName" in componentDescriptor) {
        return componentDescriptor;
    }


    if (typeof componentDescriptor === 'string') {
        const parsedComponentDescriptor = parseSimpleComponentDescriptor(componentDescriptor);
        if (!parsedComponentDescriptor) {
            logger.errorMessage(`
                Failed to parse component descriptor: "${componentDescriptor}". 
                Use format: "{componentName}", for example: "TestDto"
            `);
            return null;
        }

        return parsedComponentDescriptor;
    }

    logger.errorMessage(`Wrong component descriptor: ${JSON.stringify(componentDescriptor)}`);
    return null;
}