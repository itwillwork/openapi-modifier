import {z} from "zod";

export const parameterInConfigSchema = z.union([
    z.literal('query'),
    z.literal('header'),
    z.literal('path'),
    z.literal('cookie'),
]);

export const parameterDescriptorConfigSchema = z
    .object({
        name: z.string(),
        in: parameterInConfigSchema,
    });

export const endpointDescriptorConfigSchema = z
    .object({
        path: z.string(),
        method: z.string(),
    })