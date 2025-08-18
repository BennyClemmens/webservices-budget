import type { Entity } from './common';
import type { Place } from './place';
import type { User } from './user';

export interface Transaction extends Entity {
  amount: number;
  date: Date;
  user: Pick<User, 'id' | 'name' | 'surname'>;
  place: Omit<Place, 'rating'>;
}

export interface TransactionCreateInput {
  amount: number;
  date: Date;
  userId: number;
  placeId: number;
}

export interface TransactionUpdateInput extends TransactionCreateInput {}
