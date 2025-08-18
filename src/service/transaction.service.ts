import { prisma } from '../data';
import * as placeService from '../service/place.service';
import * as userService from '../service/user.service';

const TRANSACTION_SELECT = {
  id: true,
  amount: true,
  date: true,
  place: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const getAll = async () => {
  const transactions =  await prisma.transaction.findMany({
    select: TRANSACTION_SELECT,
  });
  return transactions;
};

export const getById = async (id: number) => {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
    },
    select: TRANSACTION_SELECT,
  });
  // if (! existingTransaction)
  //   throw new Error(`There is no transaction with id ${id}`);
  return transaction;
};

export const create = async ({ amount, date, placeId, userId }: any) => {
  const existingPlace = await placeService.getById(placeId);
  const existingUser = await userService.getById(userId);
  if (! (existingPlace && existingUser)) {
    throw new Error(`There is no place with id ${placeId} or no user with id ${userId}`);
  }
  const transaction = await prisma.transaction.create({
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
  { amount, date, placeId, userId }: any,
) => {
  const transaction = await prisma.transaction.update({
    where: {
      id,
    },
    data: {
      amount,
      date,
      place_id: placeId,
      user_id: userId,
    },
  });
  //error handling later...
  return transaction;
};

export const deleteById = async (id: number) => {
  await prisma.transaction.delete({
    where: {
      id,
    },
  });
  // no return, error handling later
};

export const getTransactionsByPlaceId = async (placeId: number) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      AND: [
        {place_id: placeId},
      ],
    },
    select: TRANSACTION_SELECT,
  });
  return transactions;
};

export const getTransactionsByUserId = async (userId: number) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      AND: [
        {user_id: userId},
      ],
    },
    select: TRANSACTION_SELECT,
  });
  return transactions;
};
