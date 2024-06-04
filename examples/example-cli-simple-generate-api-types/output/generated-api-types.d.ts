declare namespace Components {
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
declare namespace Paths {
  namespace CreatePets {
    export type RequestBody = Components.Schemas.Pet;
    namespace Responses {
      export interface $201 {}
      export type Default = Components.Schemas.Error;
    }
  }
  namespace ListPets {
    namespace Parameters {
      export type Limit = number; // int32
      export type Search = number;
      export type Tag = string;
    }
    export interface PathParameters {
      search?: Parameters.Search;
    }
    export interface QueryParameters {
      limit?: Parameters.Limit /* int32 */;
      tag: Parameters.Tag;
    }
    namespace Responses {
      export type $200 = Components.Schemas.Pets;
      export type Default = Components.Schemas.Error;
    }
  }
  namespace ShowPetById {
    namespace Parameters {
      export type PetId = string;
    }
    export interface PathParameters {
      petId: Parameters.PetId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.Pet;
      export type Default = Components.Schemas.Error;
    }
  }
  namespace V1Pets$PetId {
    namespace Delete {
      namespace Parameters {
        export type PetId = string;
      }
      export interface PathParameters {
        petId: Parameters.PetId;
      }
      namespace Responses {
        export type $200 = string;
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
