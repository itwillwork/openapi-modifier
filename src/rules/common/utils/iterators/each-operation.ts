import {OpenAPIFileT} from "../../../../openapi";

// TODO remove any
type OperationSchema = any;

type OperationCallbackT = (operationSchema: OperationSchema) => void;

export const forEachOperation = (openAPIFile: OpenAPIFileT, callback: OperationCallbackT) => {
    const paths = openAPIFile.document?.paths;

    Object.keys(paths || {}).forEach((pathKey) => {
        const path = paths?.[pathKey];

        Object.keys(path || {}).forEach((method) => {
            // @ts-expect-error bad OpenAPI types!
            const operation = path?.[method];

            callback(operation);
        });
    });
};
