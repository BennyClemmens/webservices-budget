import { prisma } from '../data';
import type { User, UserCreateInput, UserUpdateInput } from '../types/user';

export const getAll = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getById = async (id: number): Promise<User| null>  => {
  return await prisma.user.findUnique({ where: { id } });
};

export const create = async (userCreateInput: UserCreateInput): Promise<User> => {
  return await prisma.user.create({ data: userCreateInput });
};

export const updateById = async (
  id: number,
  userUpdateInput: UserUpdateInput,
): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data: userUpdateInput,
  });
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.user.delete({ where: { id } });
};
