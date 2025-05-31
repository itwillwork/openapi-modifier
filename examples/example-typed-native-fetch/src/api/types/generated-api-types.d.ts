/**
* WARNING! This file was auto-generated
**/

declare namespace Components {
    namespace Schemas {
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
    }
}
declare namespace Paths {
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
}
