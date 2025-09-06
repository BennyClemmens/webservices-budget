import type { Entity, ListResponse } from './common';
import type { Transaction } from './transaction';

export interface Place extends Entity {
  name: string;
  rating: number | null; // databases don't know 'undefined' so '?' is not an option
}

// export interface PlaceCreateInput extends Entity {
//   name: string;
//   rating: number | null;
// }

//de requestbody
export type PlaceCreateInput = Omit<Place, 'id'>;

export interface PlaceUpdateInput extends PlaceCreateInput {};

//types for the rest layer:
//requests
export interface CreatePlaceRequest extends PlaceCreateInput {}
export interface UpdatePlaceRequest extends PlaceUpdateInput {}
//responses (none for the delete)
export interface GetAllPlacesResponse extends ListResponse<Place> {}
export interface GetPlaceByIdResponse extends Place {
  transactions: Transaction[];
}
export interface CreatePlaceResponse extends Place {}
export interface UpdatePlaceResponse extends Place {}
// afhankelijk van wat ze terug geven van relaties ...
