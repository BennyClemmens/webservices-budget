import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import handleDBError from '../data/_handle_DBError';
// import { getLogger } from '../core/logging';
// import { Prisma } from '@prisma/client';
// import { NotFoundError } from '../core/NotFoundError';
import type { GetPlaceByIdResponse, Place } from '../types/place';
import type { PlaceCreateInput } from '../types/place';
import type { PlaceUpdateInput } from '../types/place';
// import type { Entity } from '../types/common';

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

export const getAll = async (): Promise<Place[]> => {
  return prisma.place.findMany();
};

/**
 * Retrieves a place by its unique ID from the database.
 *
 * @param id - The ID of the place to retrieve.
 * @returns The place object if found, otherwise throws an error.
 */
export const getById = async (id: number): Promise<GetPlaceByIdResponse> => {
  const place: GetPlaceByIdResponse|null = await prisma.place.findUnique({
    // select: PLACE_SELECT,
    where: {
      id,
    },
    //include: PLACE_INCLUDE,
    include: {
      // _count: true,
      transactions: {
        select: {
          id: true,
          amount: true,
          date: true,
          place: true,
          user: true,
          // {
          //   omit: {
          //     id: true,
          //   },
          // },
        },
      },
    },
  });
  if (!place)
    throw ServiceError.notFound(`There is no place with id ${id}`);
  //getLogger().debug(`${JSON.stringify(place)}`);
  return place;
};

// export const create = async ({ name, rating }: PlaceCreateInput): Promise<Place> => {
export const create = async (placeInput: PlaceCreateInput): Promise<Place> => {
  let place: Place;
  try {
    place = await prisma.place.create({
      data: placeInput,
    });
    return place;
  } catch (error) {
    //console.log(error);
    throw handleDBError(error);
  }
  
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
  placeUpdate: PlaceUpdateInput,
  // {id, name, rating }: Place,
): Promise<Place> => {
  let place: Place;
  try {
    place = await prisma.place.update({
      where: {
        id,
      },
      data: placeUpdate,
    });
    return place;
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.place.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const checkPlaceExists = async (id: number) => {
  const count = await prisma.place.count({
    where: {
      id,
    },
  });

  if (!count) {
    throw  ServiceError.notFound('No place with this id exists');
  }
};
