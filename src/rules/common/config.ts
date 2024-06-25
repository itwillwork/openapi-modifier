import { z } from 'zod';

export const patchMethodConfigSchema = z.union([z.literal('deepmerge'), z.literal('merge')]);

export const openAPISchemaConfigSchema = z.any();

export const parameterInConfigSchema = z.union([z.literal('query'), z.literal('header'), z.literal('path'), z.literal('cookie')]);

export const endpointParameterDescriptorConfigSchema = z
  .object({
    name: z.string(),
    in: parameterInConfigSchema,
  })
  .strict();

export const componentDescriptorConfigSchema = z
  .object({
      componentName: z.string(),
  })
  .strict();

export const endpointRequestBodyDescriptorConfigSchema = z
    .object({
        contentType: z.string(),
    })
    .strict();


export const endpointResponseDescriptorConfigSchema = z
    .object({
        code: z.string(),
        contentType: z.string(),
    })
    .strict();


export const endpointDescriptorConfigSchema = z
  .object({
    path: z.string(),
    method: z.string(),
  })
  .strict();
