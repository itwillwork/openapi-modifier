import {OpenAPIV2, OpenAPIV3, OpenAPIV3_1} from "openapi-types";
import {LoggerI} from "./logger/interface";

type OpenAPIDocumentT = OpenAPIV2.Document | OpenAPIV3.Document | OpenAPIV3_1.Document;
type OpenAPIFileContextT = {
    sourceExtension: 'json' | 'yaml';
}
type OpenAPIFileT = {
    context: OpenAPIFileContextT;
    document: OpenAPIDocumentT;
}

const readInputFile = (baseLogger: LoggerI, inputPath: string): OpenAPIFileT => {
    // TODO

    return {
        context,
        openAPI,
    }
}

const writeOutputFile = (baseLogger: LoggerI, outputPath: string, file: OpenAPIFileT): void => {
    // TODO
}

export {
    OpenAPIFileT,
    readInputFile,
    writeOutputFile,
}
