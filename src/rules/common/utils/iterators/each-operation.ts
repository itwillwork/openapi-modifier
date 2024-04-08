import {OpenAPIFileT} from "../../../../openapi";
import {HttpMethods, OperationObject} from "../../openapi-models";

type OperationSchema = OperationObject;

type OperationCallbackT = (operationSchema: OperationSchema) => void;

// TODO iterator creator
export const forEachOperation = (openAPIFile: OpenAPIFileT, callback: OperationCallbackT) => {
    const paths = openAPIFile.document?.paths;

    Object.keys(paths || {}).forEach((pathKey) => {
        const path = paths?.[pathKey];

        const methods = Object.keys(path || {}) as Array<HttpMethods>
        methods.forEach((method) => {
            const operation = path?.[method];

            if (operation) {
                callback(operation);
            }
        });
    });
};
