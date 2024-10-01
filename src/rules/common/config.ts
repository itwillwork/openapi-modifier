import { z } from 'zod';

export const patchMethodConfigSchema = z.union([z.literal('deepmerge'), z.literal('merge')]);

export const openAPISchemaConfigSchema = z.any();

export const parameterInConfigSchema = z.union([z.literal('query'), z.literal('header'), z.literal('path'), z.literal('cookie')]);
export const correctionConfigSchema = z.string().optional();

export const endpointParameterDescriptorConfigSchema = z
  .object({
    name: z.string(),
    in: parameterInConfigSchema,
  })
  .strict();

export const endpointParameterWithCorrectionDescriptorConfigSchema = z
  .object({
    name: z.string(),
    in: parameterInConfigSchema,
    correction: correctionConfigSchema.optional(),
  })
  .strict();

export const parameterDescriptorConfigSchema = z
  .object({
      path: z.string(),
      method: z.string(),
      name: z.string(),
      in: parameterInConfigSchema,
  })
  .strict();

export const simpleComponentWithCorrectionDescriptorConfigSchema = z.string();

export const componentWithCorrectionDescriptorConfigSchema = z
    .object({
        componentName: z.string(),
        correction: correctionConfigSchema.optional(),
    })
    .strict();

export const anyComponentWithCorrectionDescriptorConfigSchema = z.union([
    simpleComponentWithCorrectionDescriptorConfigSchema,
    componentWithCorrectionDescriptorConfigSchema,
]);

export const simpleComponentDescriptorConfigSchema = z.string();

export const componentDescriptorConfigSchema = z
  .object({
      componentName: z.string(),
  })
  .strict();

export const anyComponentDescriptorConfigSchema = z.union([
    simpleComponentDescriptorConfigSchema,
    componentDescriptorConfigSchema,
])

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


export const simpleEndpointDescriptorConfigSchema = z.string();

export const endpointDescriptorConfigSchema = z
  .object({
    path: z.string(),
    method: z.string(),
  })
  .strict();

export const anyEndpointDescriptorConfigSchema = z.union([
    endpointDescriptorConfigSchema,
    simpleEndpointDescriptorConfigSchema,
])

export const operationIdConfigSchema = z.string();
