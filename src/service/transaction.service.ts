import { TRANSACTIONS } from '../data/mock_data';

export const getAll = () => {
  return TRANSACTIONS;
};

export const getById = (id: number) => {
  throw new Error('Not implemented yet!' + id);
};

export const create = ({ amount, date, placeId, userId }: any) => {
  throw new Error('Not implemented yet!' + amount +  date + placeId + userId);
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
