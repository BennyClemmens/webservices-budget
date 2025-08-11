import { TRANSACTIONS, PLACES, USERS } from '../data/mock_data';

export const getAll = () => {
  return TRANSACTIONS;
};

export const getById = (id: number) => {
  const existingTransaction = TRANSACTIONS.find((t) => t.id === id);
  if (! existingTransaction)
    throw new Error(`There is no transaction with id ${id}`);
  return existingTransaction;
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

  const index = TRANSACTIONS.findIndex((t) => t.id === id);
  if (index === -1)
    throw new Error(`There is no transaction with id ${id}`);
  const existingPlace = PLACES.find((place) => place.id === placeId);
  const existingUser = USERS.find((user) => user.id === userId);

  if (! (existingPlace && existingUser)) {
    throw new Error(`There is no place with id ${placeId} or no user with id ${userId}`);
  }
  
  //const currentTransaction = TRANSACTIONS[index];
  //console.log(currentTransaction);

  const updatedTransaction = {
    ...TRANSACTIONS[index],
    id,
    amount,
    date: date.toISOString(),
    place: existingPlace,
    user: existingUser,
  };
  TRANSACTIONS[index] = updatedTransaction;
  return updatedTransaction;
};

export const deleteById = (id: number) => {
  const index = TRANSACTIONS.findIndex((t) => t.id === id);
  if (index === -1)
    throw new Error(`There is no transaction with id ${id}`);
  const deleted = TRANSACTIONS.splice(index, 1);
  if (! deleted)
    throw new Error(`Could not delete record with index ${index}`);
  console.log(JSON.stringify(deleted));
};
