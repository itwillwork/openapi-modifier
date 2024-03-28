import {OpenAPIV2, OpenAPIV3, OpenAPIV3_1} from "openapi-types";
import {LoggerI} from "./logger/interface";
import YAML from 'yaml'
import fs from "fs";

type OpenAPIDocumentT = OpenAPIV2.Document | OpenAPIV3.Document | OpenAPIV3_1.Document;
type OpenAPIFileContextT = {
    sourceExtension: 'json' | 'yaml';
}
type OpenAPIFileT = {
    context: OpenAPIFileContextT;
    document: OpenAPIDocumentT;
}

const checkIsAvailableFileExtension = (
    extensions: string | null | undefined,
): extensions is OpenAPIFileContextT['sourceExtension'] => {
    return extensions === 'json' || extensions === 'yaml';
}

const readInputFile = (baseLogger: LoggerI, inputPath: string): OpenAPIFileT => {
    const logger = baseLogger.clone('input-file');

    let contentBuffer: Buffer;
    try {
        contentBuffer = fs.readFileSync(inputPath);
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error, `Not found input file: ${inputPath}`);
        }

        throw error;
    }

    const content = contentBuffer.toString();
    const inputFileExtension = inputPath.split('.').pop() || null;
    if (!checkIsAvailableFileExtension(inputFileExtension)) {
        throw new Error(`Not processable extension! ${inputFileExtension}`);
    }

    let document: OpenAPIDocumentT | null = null;
    try {
        switch (inputFileExtension) {
            case 'yaml': {
                document = YAML.parse(content);
            }
            case 'json': {
                document = JSON.parse(content);
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error, `Parse input file: ${content}`);
        }

        throw error;
    }

    if (!document) {
        throw new Error('Empty input file!');
    }

    return {
        context: {
            sourceExtension: inputFileExtension,
        },
        document,
    }
}

const writeOutputFile = (baseLogger: LoggerI, outputPath: string, file: OpenAPIFileT): void => {
    const logger = baseLogger.clone('output-file');

    let content: string | null;
    try {
        switch (file.context.sourceExtension) {
            case 'yaml': {
                content = YAML.stringify(file.document);
            }
            case 'json': {
                content = JSON.stringify(file.document);
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error, 'Failed to stringified output');
        }

        throw error;
    }

    if (!content) {
        throw new Error('Empty content!');
    }

    try {
        fs.writeFileSync(outputPath, content);
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error, `Failed to output file: ${outputPath}`);
        }

        throw error;
    }
}

export {
    OpenAPIFileT,
    readInputFile,
    writeOutputFile,
}
