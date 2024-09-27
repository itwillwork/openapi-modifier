import {z} from 'zod';
import {anyEndpointDescriptorConfigSchema, simpleEndpointDescriptorConfigSchema} from "../../config";
import {LoggerI} from "../../../../logger/interface";

export type ParsedEndpointDescriptor = {
    path: string;
    method: string;
}

export const parseSimpleEndpointDescriptor = (
    endpointDescriptor: z.infer<typeof simpleEndpointDescriptorConfigSchema>,
): ParsedEndpointDescriptor | null => {
    if (typeof endpointDescriptor === 'string') {
        const clearEndpointDescriptor = endpointDescriptor.trim();
        if (!clearEndpointDescriptor) {
            return null;
        }

        const lastSpaceIndex = clearEndpointDescriptor.lastIndexOf(' ');
        if (lastSpaceIndex === -1) {
            return null;
        }

        const method = clearEndpointDescriptor.slice(0, lastSpaceIndex);
        const clearMethod = method.replace(/[^a-zA-Z]/g, "");

        const path = clearEndpointDescriptor.slice(lastSpaceIndex + 1);
        const clearPath = path.trim();

        return {
            path: clearPath,
            method: clearMethod,
        }
    }

    return null;
}

export const parseAnyEndpointDescriptor = (
    endpointDescriptor: z.infer<typeof anyEndpointDescriptorConfigSchema>,
    logger: LoggerI,
): ParsedEndpointDescriptor | null => {
    if (typeof endpointDescriptor === 'object' && 'path' in endpointDescriptor) {
        return {
            path: endpointDescriptor.path,
            method: endpointDescriptor.method,
        }
    }

    if (typeof endpointDescriptor === 'string') {
        const parsedEndpointDescriptor = parseSimpleEndpointDescriptor(endpointDescriptor);
        if (!parsedEndpointDescriptor) {
            logger.errorMessage(`
                Failed to parse endpoint descriptor: "${endpointDescriptor}". 
                Use format: "{method} {path}", for example: "GET /foo/bar"
            `);
            return null;
        }

        return parsedEndpointDescriptor;
    }

    logger.errorMessage(`Wrong endpoint descriptor: ${JSON.stringify(endpointDescriptor)}`);
    return null;
}