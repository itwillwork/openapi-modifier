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
    export interface PetStatistics {
      cat: number;
      dog: number;
    }
    export type Pets = Pet[];
  }
}
declare namespace ApiPaths {
  namespace ApiExternalV1PetsStatistics {
    namespace Post {
      namespace Responses {
        export type $200 = ApiComponents.Schemas.PetStatistics;
      }
    }
  }
  namespace V1Pets {
    namespace Get {
      namespace Parameters {
        export type Limit = number; // int32
        export type Search = string;
      }
      export interface QueryParameters {
        search: Parameters.Search;
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
        export interface $201 {}
        export type Default = ApiComponents.Schemas.Error;
      }
    }
  }
  namespace V1Pets$PetId {
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
  namespace V1Tags {
    namespace Post {
      export interface RequestBody {
        color: number;
        name: string;
      }
      namespace Responses {
        export interface $201 {}
      }
    }
  }
}
