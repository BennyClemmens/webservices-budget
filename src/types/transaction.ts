import type { Entity, ListResponse } from './common';
import type { Place } from './place';
import type { User } from './user';

export interface Transaction extends Entity {
  amount: number;
  date: Date;
  user: Pick<User, 'id' | 'name' | 'surname'>;
  place: Omit<Place, 'rating'>;
}

//de requestbody
export interface TransactionCreateInput {
  amount: number;
  date: Date;
  userId: number;
  placeId: number;
}

export interface TransactionUpdateInput extends TransactionCreateInput {}

//rest
export interface CreateTransactionRequest extends TransactionCreateInput {}
export interface UpdateTransactionRequest extends TransactionUpdateInput {}

export interface GetAllTransactionsReponse extends ListResponse<Transaction> {}
export interface GetTransactionByIdResponse extends Transaction {}
export interface CreateTransactionResponse extends GetTransactionByIdResponse {}
export interface UpdateTransactionResponse extends GetTransactionByIdResponse {}

export interface getTransactionsByUserIdResponse extends ListResponse<Transaction> {}
export interface getTransactionsByPlaceIdResponse extends ListResponse<Transaction> {}
