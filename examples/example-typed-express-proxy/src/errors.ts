// the format in which the http client proxy returns a response, e.g. got, axios, etc.
type HTTPClientResponse<T> = {
    statusCode: number;
    body: T;
}

// Indicates that the error occurred on the origin server rather than the proxy server
export const PROXY_ERROR_HTTP_CODE = 502;

export abstract class BaseHttpRequestError extends Error {
    abstract readonly httpStatusCode: number;
}

export class ServiceResponseError<T = unknown> extends BaseHttpRequestError {
    httpStatusCode: number;

    originalHttpStatusCode: number;

    data: T | undefined;

    public static prepareStatusCode = (statusCode: number): number => {
        if (statusCode >= 500) {
            return PROXY_ERROR_HTTP_CODE;
        }

        return statusCode;
    };

    constructor(response?: HTTPClientResponse<T> | T) {
        let message = 'Service error';
        let statusCode = PROXY_ERROR_HTTP_CODE;
        let originalStatusCode = PROXY_ERROR_HTTP_CODE;
        let data;

        if (response) {
            // eslint-disable-next-line lodash/prefer-lodash-typecheck
            if (typeof response === 'object' && 'statusCode' in response) {
                statusCode = ServiceResponseError.prepareStatusCode(response.statusCode);
                originalStatusCode = response.statusCode;

                message = `Service error ${response?.statusCode}: ${JSON.stringify(response.body || {})}`;

                data = response.body;
            } else {
                message = `Service error: ${JSON.stringify(response || {})}`;
                data = response;
            }
        }

        super(message);

        this.originalHttpStatusCode = originalStatusCode;
        this.httpStatusCode = statusCode;
        this.data = data;
    }
}