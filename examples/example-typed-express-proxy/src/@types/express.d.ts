import type { Request, Response } from 'express';

declare global {
    namespace Express {
        interface Request {
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