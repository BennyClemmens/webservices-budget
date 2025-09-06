import type { PrismaModel } from '../../src/types/prisma';
import { prisma } from '../../src/data';

export async function emptyTables(): Promise<void> {
  await prisma.transaction.deleteMany({});
  await prisma.place.deleteMany({});
  await prisma.user.deleteMany({});
}

export async function trunctateTables(): Promise<void> {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
  await prisma.$executeRaw`TRUNCATE TABLE transactions`;
  await prisma.$executeRaw`TRUNCATE TABLE places`;
  await prisma.$executeRaw`TRUNCATE TABLE users`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
}

export async function seedData<T>(model: PrismaModel<T>, data: T[], name: string) {
  const result = await model.createMany({ data });
  if (result.count < data.length) { // Did this insert operation succeed for all records?
    throw new Error(`Failed to seed ${name}! Only inserted ${result.count} of ${data.length}`);
  }

  const totalCount = await model.count(); // Does the database now contain all the rows I expect?
  if (totalCount < data.length) {
    throw new Error(`After seeding, count of ${name} is too low: ${totalCount}`);
  }
}
