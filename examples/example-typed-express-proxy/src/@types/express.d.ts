import type { Request, Response } from 'express';

declare global {
    namespace Express {
        interface Request {
            requestId: string;
            // TODO use logger: winston, pino, log4js
            logger: typeof console;

            files: Files;
            fields: Fields;
        }

        interface Response {
            result: any;
        }
    }

    export type ExpressMiddlewareShape = (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => void;
}