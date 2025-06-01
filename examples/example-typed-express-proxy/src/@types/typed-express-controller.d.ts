import type { Request, Response } from 'express';

import type { ServiceResponseError } from '../errors';

declare global {
    interface QueryI {
        [key: string]: any;
    }

    export type ExpressRouteShape = {
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

    interface TypedRequest<T extends ExpressRouteShape> extends Request {
        query: InterfaceToType<T['request']['query']>;
        headers: T['request']['headers'];
        body: T['request']['body'];
        params: T['request']['params'];

        header<Name extends string>(
            name: Name,
        ): Name extends keyof T['request']['headers']
            ? T['request']['headers'][Name]
            : string | undefined;
    }

    interface TypedResponse<T extends ExpressRouteShape> extends Response {
        result: T['responses']['success'];
    }

    type TypedNext<T extends ExpressRouteShape> = (
        error?: ServiceResponseError<T['responses']['error']>,
    ) => void;

    export type TypedController<T extends ExpressRouteShape> = (
        request: TypedRequest<T>,
        response: TypedResponse<T>,
        next: TypedNext<T>,
    ) => Promise<void> | void;

    export type ExpressMiddlewareShape = (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => void;
}