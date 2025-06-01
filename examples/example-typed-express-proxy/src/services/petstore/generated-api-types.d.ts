/**
* WARNING! This file was auto-generated
**/

declare namespace PetstoreComponents {
    namespace RequestBodies {
        export type Pet = Schemas.Pet;
        export type UserArray = Schemas.User[];
    }
    namespace Schemas {
        export interface ApiResponse {
            code?: number; // int32
            message?: string;
            type?: string;
        }
        export interface Category {
            /**
             * example:
             * 1
             */
            id?: number; // int64
            /**
             * example:
             * Dogs
             */
            name?: string;
        }
        export interface Order {
            complete?: boolean;
            /**
             * example:
             * 10
             */
            id?: number; // int64
            /**
             * example:
             * 198772
             */
            petId?: number; // int64
            /**
             * example:
             * 7
             */
            quantity?: number; // int32
            shipDate?: string; // date-time
            /**
             * Order Status
             * example:
             * approved
             */
            status?: "placed" | "approved" | "delivered";
        }
        export interface Pet {
            category?: Category;
            /**
             * example:
             * 10
             */
            id?: number; // int64
            /**
             * example:
             * doggie
             */
            name: string;
            photoUrls: string[];
            /**
             * pet status in the store
             */
            status?: "available" | "pending" | "sold";
            tags?: Tag[];
        }
        export interface Tag {
            id?: number; // int64
            name?: string;
        }
        export interface User {
            /**
             * example:
             * john@email.com
             */
            email?: string;
            /**
             * example:
             * John
             */
            firstName?: string;
            /**
             * example:
             * 10
             */
            id?: number; // int64
            /**
             * example:
             * James
             */
            lastName?: string;
            /**
             * example:
             * 12345
             */
            password?: string;
            /**
             * example:
             * 12345
             */
            phone?: string;
            /**
             * example:
             * theUser
             */
            username?: string;
            /**
             * User Status
             * example:
             * 1
             */
            userStatus?: number; // int32
        }
    }
}
declare namespace PetstorePaths {
    namespace Pet {
        namespace Post {
            export type RequestBody = PetstoreComponents.Schemas.Pet;
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.Pet;
                export interface $400 {
                }
                export interface $422 {
                }
                export interface Default {
                }
            }
        }
        namespace Put {
            export type RequestBody = PetstoreComponents.Schemas.Pet;
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.Pet;
                export interface $400 {
                }
                export interface $404 {
                }
                export interface $422 {
                }
                export interface Default {
                }
            }
        }
    }
    namespace Pet$PetId {
        namespace Delete {
            export interface HeaderParameters {
                api_key?: Parameters.ApiKey;
            }
            namespace Parameters {
                export type ApiKey = string;
                export type PetId = number; // int64
            }
            export interface PathParameters {
                petId: Parameters.PetId /* int64 */;
            }
            namespace Responses {
                export interface $200 {
                }
                export interface $400 {
                }
                export interface Default {
                }
            }
        }
        namespace Get {
            namespace Parameters {
                export type PetId = number; // int64
            }
            export interface PathParameters {
                petId: Parameters.PetId /* int64 */;
            }
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.Pet;
                export interface $400 {
                }
                export interface $404 {
                }
                export interface Default {
                }
            }
        }
        namespace Post {
            namespace Parameters {
                export type Name = string;
                export type PetId = number; // int64
                export type Status = string;
            }
            export interface PathParameters {
                petId: Parameters.PetId /* int64 */;
            }
            export interface QueryParameters {
                name?: Parameters.Name;
                status?: Parameters.Status;
            }
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.Pet;
                export interface $400 {
                }
                export interface Default {
                }
            }
        }
    }
    namespace Pet$PetIdUploadImage {
        namespace Post {
            namespace Parameters {
                export type AdditionalMetadata = string;
                export type PetId = number; // int64
            }
            export interface PathParameters {
                petId: Parameters.PetId /* int64 */;
            }
            export interface QueryParameters {
                additionalMetadata?: Parameters.AdditionalMetadata;
            }
            export type RequestBody = string; // binary
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.ApiResponse;
                export interface $400 {
                }
                export interface $404 {
                }
                export interface Default {
                }
            }
        }
    }
    namespace PetFindByStatus {
        namespace Get {
            namespace Parameters {
                export type Status = "available" | "pending" | "sold";
            }
            export interface QueryParameters {
                status?: Parameters.Status;
            }
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.Pet[];
                export interface $400 {
                }
                export interface Default {
                }
            }
        }
    }
    namespace PetFindByTags {
        namespace Get {
            namespace Parameters {
                export type Tags = string[];
            }
            export interface QueryParameters {
                tags?: Parameters.Tags;
            }
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.Pet[];
                export interface $400 {
                }
                export interface Default {
                }
            }
        }
    }
    namespace StoreInventory {
        namespace Get {
            namespace Responses {
                export interface $200 {
                    [name: string]: number; // int32
                }
                export interface Default {
                }
            }
        }
    }
    namespace StoreOrder {
        namespace Post {
            export type RequestBody = PetstoreComponents.Schemas.Order;
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.Order;
                export interface $400 {
                }
                export interface $422 {
                }
                export interface Default {
                }
            }
        }
    }
    namespace StoreOrder$OrderId {
        namespace Delete {
            namespace Parameters {
                export type OrderId = number; // int64
            }
            export interface PathParameters {
                orderId: Parameters.OrderId /* int64 */;
            }
            namespace Responses {
                export interface $200 {
                }
                export interface $400 {
                }
                export interface $404 {
                }
                export interface Default {
                }
            }
        }
        namespace Get {
            namespace Parameters {
                export type OrderId = number; // int64
            }
            export interface PathParameters {
                orderId: Parameters.OrderId /* int64 */;
            }
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.Order;
                export interface $400 {
                    /**
                     * example:
                     * 10
                     */
                    id?: number; // int64
                }
                export interface $404 {
                    message?: string;
                }
                export interface Default {
                }
            }
        }
    }
    namespace User {
        namespace Post {
            export type RequestBody = PetstoreComponents.Schemas.User;
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.User;
                export interface Default {
                }
            }
        }
    }
    namespace User$Username {
        namespace Delete {
            namespace Parameters {
                export type Username = string;
            }
            export interface PathParameters {
                username: Parameters.Username;
            }
            namespace Responses {
                export interface $200 {
                }
                export interface $400 {
                }
                export interface $404 {
                }
                export interface Default {
                }
            }
        }
        namespace Get {
            namespace Parameters {
                export type Username = string;
            }
            export interface PathParameters {
                username: Parameters.Username;
            }
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.User;
                export interface $400 {
                }
                export interface $404 {
                }
                export interface Default {
                }
            }
        }
        namespace Put {
            namespace Parameters {
                export type Username = string;
            }
            export interface PathParameters {
                username: Parameters.Username;
            }
            export type RequestBody = PetstoreComponents.Schemas.User;
            namespace Responses {
                export interface $200 {
                }
                export interface $400 {
                }
                export interface $404 {
                }
                export interface Default {
                }
            }
        }
    }
    namespace UserCreateWithList {
        namespace Post {
            export type RequestBody = PetstoreComponents.Schemas.User[];
            namespace Responses {
                export type $200 = PetstoreComponents.Schemas.User;
                export interface Default {
                }
            }
        }
    }
    namespace UserLogin {
        namespace Get {
            namespace Parameters {
                export type Password = string;
                export type Username = string;
            }
            export interface QueryParameters {
                username?: Parameters.Username;
                password?: Parameters.Password;
            }
            namespace Responses {
                export type $200 = string;
                export interface $400 {
                }
                export interface Default {
                }
            }
        }
    }
    namespace UserLogout {
        namespace Get {
            namespace Responses {
                export interface $200 {
                }
                export interface Default {
                }
            }
        }
    }
}
