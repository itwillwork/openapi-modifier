/**
* WARNING! This file was auto-generated
**/

declare namespace ApiComponents {
    namespace Schemas {
        export interface Error {
            code: number; // int32
            message: string;
        }
        export interface Pet {
            id: number; // int64
            name: string;
            tag?: string;
        }
        export type Pets = Pet[];
    }
}
declare namespace ApiPaths {
    namespace ApiV1Pets {
        namespace Get {
            namespace Parameters {
                export type Limit = number; // int32
            }
            export interface QueryParameters {
                limit?: Parameters.Limit /* int32 */;
            }
            namespace Responses {
                export type $200 = ApiComponents.Schemas.Pets;
                export type Default = ApiComponents.Schemas.Error;
            }
        }
        namespace Post {
            export type RequestBody = ApiComponents.Schemas.Pet;
            namespace Responses {
                export interface $201 {
                }
                export type Default = ApiComponents.Schemas.Error;
            }
        }
    }
    namespace ApiV1Pets$PetId {
        namespace Get {
            namespace Parameters {
                export type PetId = string;
            }
            export interface PathParameters {
                petId: Parameters.PetId;
            }
            namespace Responses {
                export type $200 = ApiComponents.Schemas.Pet;
                export type Default = ApiComponents.Schemas.Error;
            }
        }
    }
}
