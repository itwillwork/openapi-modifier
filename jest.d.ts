import { MatcherFunction } from "expect";
import {LoggerI} from "./src/logger/interface";
import {OpenAPIFileT} from "./src/openapi";

declare global {

    namespace jest {
        interface Matchers<R, T> {
            toBeCalledLoggerMethod(messageRegExp: RegExp, count?: number): R;
        }

        interface Expect {
        }

        interface ExpectExtendMap {
        }
    }

    var createFakeLogger: () => LoggerI;
    var createFakeOpenAPIFile: (document: Partial<OpenAPIFileT['document']>) => OpenAPIFileT;
}

export {};
