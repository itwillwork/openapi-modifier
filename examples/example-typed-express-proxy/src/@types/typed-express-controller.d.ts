import type { Request, Response } from 'express';

import type { ServiceResponseError } from '../errors';

declare global {
    interface QueryI {
        [key: string]: any;
    }

    export type ExpressRouteT = {
        request: {
            query?: QueryI;
            headers?: any;
            body?: any;
            params?: any;
            fields?: any;
            files?: Files;
        };
        responses: {
            success: any;
            error: any;
        };
    };

    interface TypedRequest<T extends ExpressRouteT> extends Request {
        query: InterfaceToTypeT<T['request']['query']>;
        headers: T['request']['headers'];
        body: T['request']['body'];
        params: T['request']['params'];

        header<Name extends string>(
            name: Name,
        ): Name extends keyof T['request']['headers']
            ? T['request']['headers'][Name]
            : string | undefined;
    }

    interface TypedResponse<T extends ExpressRouteT> extends Response {
        result: T['responses']['success'];
    }

    type TypedNext<T extends ExpressRouteT> = (
        error?: ServiceResponseError<T['responses']['error']>,
    ) => void;

    export type TypedController<T extends ExpressRouteT> = (
        request: TypedRequest<T>,
        response: TypedResponse<T>,
        next: TypedNext<T>,
    ) => Promise<void> | void;

    export type ExpressMiddlewareT = (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => void;
}