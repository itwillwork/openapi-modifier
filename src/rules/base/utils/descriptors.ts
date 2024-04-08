import {z} from "zod";

export const parameterInConfigSchema = z.union([
    z.literal('query'),
    z.literal('header'),
    z.literal('path'),
    z.literal('cookie'),
]);