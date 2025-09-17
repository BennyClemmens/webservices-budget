import { prisma } from '../data';
import * as placeService from '../service/place.service';
// import * as userService from '../service/user.service';
import type { Transaction, TransactionCreateInput, TransactionUpdateInput } from '../types/transaction';
// import type { Place } from '../types/place';
// import type { User } from '../types/user';
import ServiceError from '../core/serviceError';
import handleDBError from '../data/_handle_DBError';
import Role from '../core/roles';

const TRANSACTION_SELECT = {
  id: true,
  amount: true,
  date: true,
  place: {
    select: {
      id: true,
      name: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      surname: true,
    },
  },
};

export const getAll = async (userId: number, roles: string[]): Promise<Transaction[]> => {
  const transactions: Transaction[] =  await prisma.transaction.findMany({
    where: roles.includes(Role.ADMIN) ? {} : { user_id: userId },
    select: TRANSACTION_SELECT,
  });
  return transactions;
};

export const getById = async (id: number, userId: number, roles: string[]): Promise<Transaction> => {
  const extraFilter = roles.includes(Role.ADMIN) ? {} : { user_id: userId };
  const transaction: Transaction | null = await prisma.transaction.findUnique({
    where: {
      id,
      ...extraFilter,
    },
    select: TRANSACTION_SELECT,
  });
  if (! transaction)
    throw ServiceError.notFound(`No transaction with this id ${id} exists`);
  return transaction;
};

export const create = async ({ amount, date, placeId, userId }: TransactionCreateInput): Promise<Transaction> => {
  // const existingPlace: Place = await placeService.getById(placeId);
  // const existingUser: User|null = await userService.getById(userId);
  // if (! (existingPlace && existingUser)) {
  //   throw new Error(`There is no place with id ${placeId} or no user with id ${userId}`);
  // }

  let transaction: Transaction; 
  try {
    await placeService.checkPlaceExists(placeId);
    // user ?
    transaction = await prisma.transaction.create({
      data: {
        amount,
        date,
        user_id : userId,
        place_id : placeId,
      },
      select: TRANSACTION_SELECT,
    });
    return transaction;
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (
  id: number,
  { amount, date, placeId, userId }: TransactionUpdateInput): Promise<Transaction> => {
  let transaction : Transaction;
  try {
    await placeService.checkPlaceExists(placeId);
    transaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        amount,
        date,
        place_id: placeId,
        user_id: userId,
      },
      select: TRANSACTION_SELECT,
    });
    return transaction;
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number, userId: number): Promise<void> => {
  try {
    await prisma.transaction.delete({
      where: {
        id,
        user_id: userId,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getTransactionsByPlaceId = async (placeId: number, userId: number): Promise<Transaction[]> => {
  const transactions: Transaction[] = await prisma.transaction.findMany({
    where: {
      user_id: userId,
      place_id: placeId,
    },
    select: TRANSACTION_SELECT,
  });
  return transactions;
};

export const getTransactionsByUserId = async (userId: number): Promise<Transaction[]> => {
  const transactions: Transaction[] = await prisma.transaction.findMany({
    where: {
      AND: [
        {user_id: userId},
      ],
    },
    select: TRANSACTION_SELECT,
  });
  return transactions;
};
