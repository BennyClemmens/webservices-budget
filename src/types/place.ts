import type { Entity } from './common';

export interface Place extends Entity {
  name: string;
  rating: number | null;
}

// export interface PlaceCreateInput extends Entity {
//   name: string;
//   rating: number | null;
// }

export type PlaceCreateInput = Omit<Place, 'id'>;

export interface PlaceUpdateInput extends PlaceCreateInput {};
