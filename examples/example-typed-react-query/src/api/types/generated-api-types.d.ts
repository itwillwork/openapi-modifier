declare namespace Components {
    namespace RequestBodies {
        export type Pet = Schemas.Pet;
        export type UserArray = Schemas.User[];
    }
    namespace Schemas {
        export interface ApiResponse {
            code?: number; // int32
            type?: string;
            message?: string;
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
            complete?: boolean;
        }
        export interface Pet {
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
            category?: Category;
            photoUrls: string[];
            tags?: Tag[];
            /**
             * pet status in the store
             */
            status?: "available" | "pending" | "sold";
        }
        export interface Tag {
            id?: number; // int64
            name?: string;
        }
        export interface User {
            /**
             * example:
             * 10
             */
            id?: number; // int64
            /**
             * example:
             * theUser
             */
            username?: string;
            /**
             * example:
             * John
             */
            firstName?: string;
            /**
             * example:
             * James
             */
            lastName?: string;
            /**
             * example:
             * john@email.com
             */
            email?: string;
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
             * User Status
             * example:
             * 1
             */
            userStatus?: number; // int32
        }
    }
}
declare namespace Paths {
    namespace AddPet {
        export type RequestBody = Components.Schemas.Pet;
        namespace Responses {
            export type $200 = Components.Schemas.Pet;
            export interface $400 {
            }
            export interface $422 {
            }
            export interface Default {
            }
        }
    }
    namespace CreateUser {
        export type RequestBody = Components.Schemas.User;
        namespace Responses {
            export type $200 = Components.Schemas.User;
            export interface Default {
            }
        }
    }
    namespace CreateUsersWithListInput {
        export type RequestBody = Components.Schemas.User[];
        namespace Responses {
            export type $200 = Components.Schemas.User;
            export interface Default {
            }
        }
    }
    namespace DeleteOrder {
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
    namespace DeletePet {
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
    namespace DeleteUser {
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
    namespace FindPetsByStatus {
        namespace Parameters {
            export type Status = "available" | "pending" | "sold";
        }
        export interface QueryParameters {
            status?: Parameters.Status;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Pet[];
            export interface $400 {
            }
            export interface Default {
            }
        }
    }
    namespace FindPetsByTags {
        namespace Parameters {
            export type Tags = string[];
        }
        export interface QueryParameters {
            tags?: Parameters.Tags;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Pet[];
            export interface $400 {
            }
            export interface Default {
            }
        }
    }
    namespace GetInventory {
        namespace Responses {
            export interface $200 {
                [name: string]: number; // int32
            }
            export interface Default {
            }
        }
    }
    namespace GetOrderById {
        namespace Parameters {
            export type OrderId = number; // int64
        }
        export interface PathParameters {
            orderId: Parameters.OrderId /* int64 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Order;
            export interface $400 {
            }
            export interface $404 {
            }
            export interface Default {
            }
        }
    }
    namespace GetPetById {
        namespace Parameters {
            export type PetId = number; // int64
        }
        export interface PathParameters {
            petId: Parameters.PetId /* int64 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Pet;
            export interface $400 {
            }
            export interface $404 {
            }
            export interface Default {
            }
        }
    }
    namespace GetUserByName {
        namespace Parameters {
            export type Username = string;
        }
        export interface PathParameters {
            username: Parameters.Username;
        }
        namespace Responses {
            export type $200 = Components.Schemas.User;
            export interface $400 {
            }
            export interface $404 {
            }
            export interface Default {
            }
        }
    }
    namespace LoginUser {
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
    namespace LogoutUser {
        namespace Responses {
            export interface $200 {
            }
            export interface Default {
            }
        }
    }
    namespace PlaceOrder {
        export type RequestBody = Components.Schemas.Order;
        namespace Responses {
            export type $200 = Components.Schemas.Order;
            export interface $400 {
            }
            export interface $422 {
            }
            export interface Default {
            }
        }
    }
    namespace UpdatePet {
        export type RequestBody = Components.Schemas.Pet;
        namespace Responses {
            export type $200 = Components.Schemas.Pet;
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
    namespace UpdatePetWithForm {
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
            export type $200 = Components.Schemas.Pet;
            export interface $400 {
            }
            export interface Default {
            }
        }
    }
    namespace UpdateUser {
        namespace Parameters {
            export type Username = string;
        }
        export interface PathParameters {
            username: Parameters.Username;
        }
        export type RequestBody = Components.Schemas.User;
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
    namespace UploadFile {
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
            export type $200 = Components.Schemas.ApiResponse;
            export interface $400 {
            }
            export interface $404 {
            }
            export interface Default {
            }
        }
    }
}

export { Paths };
export { Components };
