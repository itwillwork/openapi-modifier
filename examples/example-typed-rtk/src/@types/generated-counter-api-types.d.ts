export declare namespace Components {
    namespace Responses {
        export type ServerError = Schemas.Error;
    }
    namespace Schemas {
        export interface CounterRequest {
            /**
             * Counter value to save
             * example:
             * 42
             */
            value: number; // int32
        }
        export interface CounterResponse {
            /**
             * Current counter value
             * example:
             * 42
             */
            value: number; // int32
        }
        export interface Error {
            /**
             * Error message
             * example:
             * Invalid request format
             */
            message: string;
        }
    }
}
export declare namespace Paths {
    namespace GetCounter {
        namespace Responses {
            export type $200 = Components.Schemas.CounterResponse;
            export type $500 = Components.Responses.ServerError;
        }
    }
    namespace SaveCounter {
        export type RequestBody = Components.Schemas.CounterRequest;
        namespace Responses {
            export type $200 = Components.Schemas.CounterResponse;
            export type $400 = Components.Schemas.Error;
            export type $500 = Components.Responses.ServerError;
        }
    }
}
