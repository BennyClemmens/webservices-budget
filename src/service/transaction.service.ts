import { prisma } from '../data';
import * as placeService from '../service/place.service';
import * as userService from '../service/user.service';
import type { Transaction, TransactionCreateInput, TransactionUpdateInput } from '../types/transaction';
import type { Place } from '../types/place';
import type { User } from '../types/user';

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

export const getAll = async (): Promise<Transaction[]> => {
  const transactions: Transaction[] =  await prisma.transaction.findMany({
    select: TRANSACTION_SELECT,
  });
  return transactions;
};

export const getById = async (id: number): Promise<Transaction> => {
  const transaction: Transaction | null = await prisma.transaction.findUnique({
    where: {
      id,
    },
    select: TRANSACTION_SELECT,
  });
  if (! transaction)
    throw new Error(`There is no transaction with id ${id}`);
  return transaction;
};

export const create = async ({ amount, date, placeId, userId }: TransactionCreateInput): Promise<Transaction> => {
  const existingPlace: Place = await placeService.getById(placeId);
  const existingUser: User|null = await userService.getById(userId);
  if (! (existingPlace && existingUser)) {
    throw new Error(`There is no place with id ${placeId} or no user with id ${userId}`);
  }
  const transaction : Transaction = await prisma.transaction.create({
    data: {
      amount,
      date,
      user_id : userId,
      place_id : placeId,
    },
    select: TRANSACTION_SELECT,
  });
  return transaction;
};

export const updateById = async (
  id: number,
  { amount, date, placeId, userId }: TransactionUpdateInput): Promise<Transaction> => {
  const transaction : Transaction = await prisma.transaction.update({
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
  //error handling later...
  return transaction;
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.transaction.delete({
    where: {
      id,
    },
  });
  // no return, error handling later
};

export const getTransactionsByPlaceId = async (placeId: number): Promise<Transaction[]> => {
  const transactions: Transaction[] = await prisma.transaction.findMany({
    where: {
      AND: [
        {place_id: placeId},
      ],
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
