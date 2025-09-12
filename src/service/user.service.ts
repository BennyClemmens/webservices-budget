import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import handleDBError from '../data/_handle_DBError';
import type { User, UserCreateInput, UserUpdateInput } from '../types/user';

export const getAll = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getById = async (id: number): Promise<User>  => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw ServiceError.notFound(`No user with this id ${id} exists`);
  }
  return user;
};

export const create = async (userCreateInput: UserCreateInput): Promise<User> => {
  //return await prisma.user.create({ data: userCreateInput });
  try {
    return await prisma.user.create({ data: userCreateInput });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (
  id: number,
  userUpdateInput: UserUpdateInput,
): Promise<User> => {
  try {
    return await prisma.user.update({
      where: { id },
      data: userUpdateInput,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try{
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    throw handleDBError(error);
  }
};
