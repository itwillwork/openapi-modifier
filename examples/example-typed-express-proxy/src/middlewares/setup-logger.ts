import {nanoid} from 'nanoid';

const setupLoggerMiddleware: ExpressMiddlewareShape = (request, response, next) => {
    const requestId = nanoid(6);
    request.requestId = requestId

    request.logger = console;

    response.setHeader('X-Request-Id', requestId);
    next();
};

export { setupLoggerMiddleware };