import type {ErrorRequestHandler} from 'express';
import {nanoid} from 'nanoid';
import {BaseHttpRequestError, NotFoundRequestError, ServiceResponseError, UnauthorizedRequestError,} from '../errors';

const responseHandlerMiddleware: ExpressMiddlewareShape = (request, response, next) => {
    if (typeof response.result === "undefined") {
        next(new NotFoundRequestError());
        return;
    }

    response.status(200).json(response.result);
    next();
};

const errorResponseHandlerMiddleware: ErrorRequestHandler = (error, request, response, next) => {
    const eventId = nanoid(6);

    let httpStatusCode;
    if (error instanceof BaseHttpRequestError) {
        httpStatusCode = error.httpStatusCode;
    } else {
        httpStatusCode = 500;
    }

    const originalHttpStatusCode =
        error instanceof ServiceResponseError ? error.originalHttpStatusCode : error.httpStatusCode;

    const commonResponseBody = {
        meta: {
            eventId,
            message: error.message,
            time: Date.now(),
            requestId: request.requestId,
            originalHttpStatusCode,
        },
    };

    let responseBody;

    if (error instanceof ServiceResponseError || error instanceof UnauthorizedRequestError) {
        responseBody = {
            ...commonResponseBody,
            ...error.data,
        };
    } else {
        responseBody = commonResponseBody;
    }

    response.status(httpStatusCode).json(responseBody);

    const logInfo: Record<string, any> = {
        eventId,
        statusCode: httpStatusCode,
        err: error,
    };

    if (response.statusCode >= 500) {
        request.logger.error(logInfo);
    } else {
        request.logger.warn(logInfo);
    }

    next();
};

export { errorResponseHandlerMiddleware, responseHandlerMiddleware };