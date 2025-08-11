import { TRANSACTIONS, PLACES, USERS } from '../data/mock_data';

export const getAll = () => {
  return TRANSACTIONS;
};

export const getById = (id: number) => {
  throw new Error('Not implemented yet!' + id);
};

export const create = ({ amount, date, placeId, userId }: any) => {
  const existingPlace = PLACES.find((place) => place.id === placeId);
  const existingUser = USERS.find((user) => user.id === userId);
  if (! (existingPlace && existingUser)) {
    throw new Error(`There is no place with id ${placeId} or no user with id ${userId}`);
  }
  const maxId = Math.max(...TRANSACTIONS.map((i) => i.id));
  const newTransaction = { // objec literal !
    id: maxId + 1,
    amount,
    date: date.toISOString(),
    place: existingPlace,
    user: existingUser,
    //user: { id: Math.floor(Math.random() * 100000), name: user }, => wouldn't work (surname...)
  };
  TRANSACTIONS.push(newTransaction);
  return newTransaction;
};

export const updateById = (
  id: number,
  { amount, date, placeId, userId }: any,
) => {
  throw new Error('Not implemented yet!' + id + amount + date + placeId +userId);
};

export const deleteById = (id: number) => {
  throw new Error('Not implemented yet!' + id);
};
