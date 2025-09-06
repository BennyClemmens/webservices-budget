import type { Prisma } from '@prisma/client';

// export const DATATODELETEIDS = {
//   t: [1, 2, 3],
//   p: [1],
//   u: [1],
// };

type NonEmptyArray<T> = [T, ...T[]];

export const TESTDATA: {
  t: NonEmptyArray<Prisma.TransactionCreateManyInput & { id: number }>;
  p: NonEmptyArray<Prisma.PlaceCreateManyInput & { id: number }>;
  u: NonEmptyArray<Prisma.UserCreateManyInput & { id: number }>;
}
// export const TESTDATA: {
//   t: Prisma.TransactionCreateManyInput[],
//   p: Prisma.PlaceCreateManyInput[],
//   u: Prisma.UserCreateManyInput[]}
  = {
    t: [
      {
        id: 1,
        user_id: 1,
        place_id: 1,
        amount: 3500,
        date: new Date(2021, 4, 25, 19, 40),
      },
      {
        id: 2,
        user_id: 1,
        place_id: 1,
        amount: -220,
        date: new Date(2021, 4, 8, 20, 0),
      },
      {
        id: 3,
        user_id: 1,
        place_id: 1,
        amount: -74,
        date: new Date(2021, 4, 21, 14, 30),
      },
    ],
    p: [
      {
        id: 1,
        name: 'Test place',
        rating: 3,
      },
    ],
    u: [
      {
        id: 1,
        name: 'Test User Name',
        surname: 'Test User Surname',
      },
    ],
  };

//perhaps not needed at all...
// export const DATATODELETEIDS = (() => {
//   return {
//     t: TESTDATA.t.map((t) => t.id), //.filter((id): id is number => id !== undefined),
//     p: TESTDATA.p.map((p) => p.id), //.filter((id): id is number => id !== undefined),
//     u: TESTDATA.u.map((u) => u.id), //.filter((id): id is number => id !== undefined),
//   };
// })();

// helper function, later to be moved
const validateTestData = () => {
  if (!TESTDATA.u.length) throw new Error('TESTDATA.u must contain at least one user!');
  if (!TESTDATA.p.length) throw new Error('TESTDATA.p must contain at least one place!');
  if (!TESTDATA.t.length) throw new Error('TESTDATA.t must contain at least one transaction!');

  // Optional deeper validation: ensure transactions testdata reference existing users/places
  const userIds = new Set(TESTDATA.u.map((u) => u.id));
  const placeIds = new Set(TESTDATA.p.map((p) => p.id));
  for (const tx of TESTDATA.t) {
    if (!userIds.has(tx.user_id))
      throw new Error(`Transaction ${tx.id} references non-existent user ${tx.user_id}`);
    if (!placeIds.has(tx.place_id))
      throw new Error(`Transaction ${tx.id} references non-existent place ${tx.place_id}`);
  }
};

// --- Automatic validation at module load ---
validateTestData();
