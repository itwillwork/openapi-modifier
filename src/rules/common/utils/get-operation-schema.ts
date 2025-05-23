import { OpenAPIFileT } from '../../../openapi';
import { checkIsHttpMethod, HttpMethods, OperationObject } from '../openapi-models';
import { normalizeMethod } from './normilizers';

export const getOperationSchema = (openAPIFile: OpenAPIFileT, path: string, method: string): OperationObject | null => {
  const pathObjSchema = openAPIFile?.document?.paths?.[path];

  const methods = Object.keys(pathObjSchema || {}).filter(checkIsHttpMethod);

  const targetMethod = methods.find((pathMethod) => {
    return normalizeMethod(pathMethod) === normalizeMethod(method);
  });

  if (!targetMethod) {
    return null;
  }

  return pathObjSchema?.[targetMethod] || null;
};
