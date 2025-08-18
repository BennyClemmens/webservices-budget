import { prisma } from '../data';

export const getAll = async () => {
  return await prisma.user.findMany();
};

export const getById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const create = async ({ name, surname }: any) => {
  return await prisma.user.create({ data: { name, surname } });
};

export const updateById = async (
  id: number,
  { name, surname }: any,
) => {
  return await prisma.user.update({
    where: { id },
    data: { name, surname },
  });
};

export const deleteById = async (id: number) => {
  await prisma.user.delete({ where: { id } });
};
