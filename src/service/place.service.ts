//import { PLACES } from '../data/mock_data';
import { prisma } from '../data';
import { getLogger } from '../core/logging';
import { Prisma } from '@prisma/client';
import { NotFoundError } from '../core/NotFoundError';

// const PLACE_SELECT: Prisma.PlaceSelect = {
//   // id: true,
//   name: true,
//   rating: true,
//   //transactions: true,
// };

// const USER_SELECT: Prisma.UserSelect = {
//   name: true,
//   surname: true,
// };

// const TRANSACTION_SELECT: Prisma.TransactionSelect = {
//   amount: true,
//   date: true,
//   user: {
//     select: USER_SELECT,
//   },
// };

// const PLACE_INCLUDE: Prisma.PlaceInclude = {
//   _count: true,
//   transactions: {
//     select: TRANSACTION_SELECT,
//   },
// };

export const getAll = async () => {
  // return prisma.place.findMany({
  //   select: PLACE_SELECT,
  // });
  return prisma.place.findMany();
};

/**
 * Retrieves a place by its unique ID from the database.
 *
 * @param id - The ID of the place to retrieve.
 * @returns The place object if found, otherwise throws an error.
 */
export const getById = async (id: number) => {
  try {
    const place = await prisma.place.findUniqueOrThrow({
      // select: PLACE_SELECT,
      where: {
        id,
      },
      //include: PLACE_INCLUDE,
      // include: {
      //   _count: true,
      //   transactions: {
      //     select: {
      //     //  id: true,
      //       amount: true,
      //       date: true,
      //       //   //place: true,
      //       user: {
      //         omit: {
      //           id: true,
      //         },
      //       },
      //     },
      //   },
      // },
    });
    getLogger().debug(`${JSON.stringify(place)}`);
    return place;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') { // specific Prisma error
      throw new NotFoundError(`There is no place with id ${id}`);
    }
    throw error; // Re-throw other unexpected errors
  }
};

export const create = async ({ name, rating }: any) => {
  const place = await prisma.place.create({
    data: {
      name,
      rating,
    },
  });
  return place;
  
  // const maxId = Math.max(...PLACES.map((i) => i.id));
  // const newPlace = { // objec literal !
  //   id: maxId + 1,
  //   name,
  //   rating,
  // };
  // PLACES.push(newPlace);
  // return newPlace;
};

export const updateById = async (
  id: number,
  { name, rating }: any,
) => {
  const place = await prisma.place.update({
    where: {
      id,
    },
    data: {
      name,
      rating,
    },
  });
  return place;
  // error handling: later
};

export const deleteById = async (id: number) => {
  await prisma.place.delete({
    where: {
      id,
    },
  });
  // error handling later, no return
};
