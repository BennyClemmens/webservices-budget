import supertest from 'supertest';
import createServer from '../../src/core/createServer';
import type { BudgetServer } from '../../src/types/server';
import { prisma } from '../../src/data';
import { TESTDATA } from '../../src/data/mock_test_data';

async function resetTables() {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
  await prisma.$executeRaw`TRUNCATE TABLE transactions`;
  await prisma.$executeRaw`TRUNCATE TABLE places`;
  await prisma.$executeRaw`TRUNCATE TABLE users`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
}

type PrismaDelegate<T> = {
  createMany(args: { data: T[] }): Promise<{ count: number }>;
  count(): Promise<number>;
};

async function seedData<T>(model: PrismaDelegate<T>, data: T[], name: string) {
  const result = await model.createMany({ data });
  if (result.count < data.length) {
    throw new Error(`Failed to seed ${name}! Only inserted ${result.count} of ${data.length}`);
  }

  const totalCount = await model.count();
  if (totalCount < data.length) {
    throw new Error(`After seeding, count of ${name} is too low: ${totalCount}`);
  }
}

describe('Transactions suite', () => {
  let budgetServer: BudgetServer;
  let request: supertest.Agent;

  beforeAll(async () => {
    budgetServer = await createServer();
    request = supertest(budgetServer.getApp().callback());
  });

  afterAll(() => {
    budgetServer.stop();  // to close databas connection // of: await shutdownData();
  });

  const url: string = '/api/transactions';

  describe(`GET ${url}`, () => {

    beforeAll(async () => { // or EACH ?
      await resetTables();
      // Insert fresh data before each test
      // Usage in your test
      await seedData(prisma.user, TESTDATA.u, 'users');
      await seedData(prisma.place, TESTDATA.p, 'places');
      await seedData(prisma.transaction, TESTDATA.t, 'transactions');

      // // Insert users
      // await prisma.user.createMany({ data: TESTDATA.u });
      // const uCount = await prisma.user.count();
      // if (uCount < TESTDATA.u.length || uCount === 0) {
      //   throw new Error('Failed to seed users. Check TESTDATA.u!');
      // }
    
      // // Insert places
      // await prisma.place.createMany({ data: TESTDATA.p });
      // const pCount = await prisma.place.count();
      // if (pCount < TESTDATA.p.length || pCount === 0) {
      //   throw new Error('Failed to seed places. Check TESTDATA.p!');
      // }

      // // Insert transactions
      // await prisma.transaction.createMany({ data: TESTDATA.t });
      // const tCount = await prisma.transaction.count();
      // if (tCount < TESTDATA.t.length || tCount === 0) {
      //   throw new Error('Failed to seed transactions. Check TESTDATA.t!');
      // }
    });

    afterAll(async () => {  // or EACH?
      await resetTables();
      // // Delete in dependency order (transaction → place → user)
      // // await prisma.transaction.deleteMany({ where: { id: { in: DATATODELETEIDS.t } } });
      // // await prisma.place.deleteMany({ where: { id: { in: DATATODELETEIDS.p } } });
      // // await prisma.user.deleteMany({ where: { id: { in: DATATODELETEIDS.u } } });

      // // await prisma.transaction.deleteMany({});
      // // await prisma.place.deleteMany({});
      // // await prisma.user.deleteMany({});

      // await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
      // // await prisma.transaction.deleteMany({});
      // // await prisma.place.deleteMany({});
      // // await prisma.user.deleteMany({});

      // await prisma.$executeRaw`TRUNCATE TABLE transactions`;
      // await prisma.$executeRaw`TRUNCATE TABLE places`;
      // await prisma.$executeRaw`TRUNCATE TABLE users`;

      // await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    });

    it('should 200 and return all transactions', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      //console.log(response.body);
      expect(response.body.items).toEqual(
        expect.arrayContaining(
          TESTDATA.t.map(
            (t) => ({
              id: t.id,
              user: {
                id :t.user_id,
                name: 'Test User Name',
                surname: 'Test User Surname',
              },
              place: {
                id: t.place_id,
                name: 'Test place',
              //rating: 3, // NOT GIVEN BACK?
              },
              amount: t.amount,
              date: new Date(t.date).toJSON(),
            })).slice(0, 2),
        ),

        //     [
        //       {
        //         id: 2,
        //         user: {
        //           id: 1,
        //           name: 'Test User Name',
        //           surname: 'Test User Surname',
        //         },
        //         place: {
        //           id: 1,
        //           name: 'Test place',
        //           // rating: 3,
        //         },
        //         amount: -220,
        //         date: new Date(2021, 4, 8, 20, 0).toJSON(),
        //       },
        //       {
        //         id: 3,
        //         user: {
        //           id: 1,
        //           name: 'Test User Name',
        //           surname: 'Test User Surname',
        //         },
        //         place: {
        //           id: 1,
        //           name: 'Test place',
        //           // rating: 3,
        //         },
        //         amount: -74,
        //         date: new Date(2021, 4, 21, 14, 30).toJSON(),
        //       },
        //     ],
        //   ),

      );
    });

    // it('should insert 3 transactions', async () => {
    //   const count = await prisma.transaction.count();
    //   expect(count).toBe(3);
    // });

    it('should link a transaction to the test user', async () => {
      const { id: firstUserId } = TESTDATA.u[0]; // exists because mock_test_data validates it on import
      const tx = await prisma.transaction.findFirst({
        where: { user_id: firstUserId },
      });
      expect(tx).not.toBeNull();
      expect(tx?.user_id).toBe(firstUserId);
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

  });

  describe(`GET ${url}/:id`, () => {

    //const url = '/api/transactions';

    beforeAll(async () => { // or EACH ?
      await resetTables();
      await seedData(prisma.user, TESTDATA.u, 'users');
      await seedData(prisma.place, TESTDATA.p, 'places');
      await seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {  // or EACH?
      await resetTables();
    });

    it('should 200 and return the requested transaction', async () => {
      const response = await request.get(`${url}/1`);

      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual({
        id: 1,
        user: {
          id: 1,
          name: 'Test User Name',
          surname: 'Test User Surname',
        },
        place: {
          id: 1,
          name: 'Test place',
          // rating: 3,
        },
        amount: 3500,
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });
  });

  // TODO: NA validatie:
  // testen of de statuscode 404 is als de transactie niet bestaat
  // testen of de statuscode 400 is als de id geen nummer is

  it('should 404 when requesting not existing transaction', async () => {
    const response = await request.get(`${url}/200`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      code: 'NOT_FOUND',
      message: 'No transaction with this id 200 exists',
    });
    expect(response.body.stack).toBeTruthy();
  });

  it('should 400 with invalid transaction id', async () => {
    const response = await request.get(`${url}/invalid`);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('VALIDATION_FAILED');
    expect(response.body.details.params).toHaveProperty('id');
  });

  describe('POST /api/transactions', () => {
    //const transactionsToDelete: number[] = [];

    beforeAll(async () => {
      await resetTables();
      await seedData(prisma.user, TESTDATA.u, 'users');
      await seedData(prisma.place, TESTDATA.p, 'places');
      await seedData(prisma.transaction, TESTDATA.t, 'transactions');
      // await prisma.place.createMany({ data: data.places });
      // await prisma.user.createMany({ data: data.users });
    });

    afterAll(async () => {
      // await prisma.transaction.deleteMany({
      //   where: { id: { in: transactionsToDelete } },
      // });
      await prisma.transaction.deleteMany({});
      await prisma.place.deleteMany({});
      await prisma.user.deleteMany({});

      // await prisma.place.deleteMany({
      //   where: { id: { in: dataToDelete.places } },
      // });

      // await prisma.user.deleteMany({
      //   where: { id: { in: dataToDelete.users } },
      // });
    });

    it('should 201 and return the created transaction', async () => {
      const response = await request.post(url).send({
        amount: 102,
        date: '2021-05-27T13:00:00.000Z',
        placeId: 1,
        userId: 1,
      });
    
      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.id).toEqual(4);
      expect(response.body.amount).toBe(102);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: 1,
        name: 'Test place',
        //rating: 3,
      });
      expect(response.body.user).toEqual({
        id: 1,
        name: 'Test User Name',
        surname: 'Test User Surname',
      });
    
      //transactionsToDelete.push(response.body.id);
    });

    // it should have been added as a user in the database?

    it('should 404 when place does not exist', async () => {
      const response = await request.post(url)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 123,
          userId: 1,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No place with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing amount', async () => {
      const response = await request.post(url)
        .send({
          date: '2021-05-27T13:00:00.000Z',
          placeId: 4,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing date', async () => {
      const response = await request.post(url)
        .send({
          amount: 102,
          placeId: 4,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('date');
    });

    it('should 400 when missing placeId', async () => {
      const response = await request.post(url)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('placeId');
    });
    
  });

  // TODO NA validatie
  // testen of de statuscode 400 is als de request body niet geldig is 
  // (bv. een property ontbreekt of heeft een ongeldige waarde)
  // testen of de statuscode 404 is als de place niet bestaat

  describe('PUT /api/transactions/:id', () => {

    beforeAll(async () => { // or EACH ?
      await resetTables();
      await seedData(prisma.user, TESTDATA.u, 'users');
      await seedData(prisma.place, TESTDATA.p, 'places');
      await seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {  // or EACH?
      await resetTables();
    });

    it('should 200 and return the updated transaction', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
          userId: 1,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.amount).toBe(-125);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: 1,
        name: 'Test place',
        // rating: 3,
      });
      const testuser = TESTDATA.u[0];
      // expect(response.body.user).toEqual({
      //   id: 1,
      //   name: 'Test User',
      //   surname: 'Test User Surname',
      // });
      expect(response.body.user).toEqual(testuser);
    });

    it('should 404 when updating not existing transaction', async () => {
      const response = await request.put(`${url}/200`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
          userId: 1,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No transaction with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 404 when place does not exist', async () => {
      const response = await request.put(`${url}/2`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 123,
          userId: 1,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No place with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing amount', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
          userId: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing date', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          amount: 102,
          placeId: 1,
          userId: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('date');
    });

    it('should 400 when missing placeId', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
          userId: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('placeId');
    });
  });

  // TODO na validatie
  // testen of de statuscode 400 is als de request body niet geldig is 
  // (bv. een property ontbreekt of heeft een ongeldige waarde)
  // testen of de statuscode 404 is als de place niet bestaat

  describe('DELETE /api/transactions/:id', () => {

    beforeAll(async () => { // or EACH ?
      await resetTables();
      await seedData(prisma.user, TESTDATA.u, 'users');
      await seedData(prisma.place, TESTDATA.p, 'places');
      await seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {  // or EACH?
      await resetTables();
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});

      // check the number of transacions?

      const countAfterDelete = await prisma.transaction.count();
      expect(countAfterDelete).toBe(2);
    });

    it('should 404 with not existing place', async () => {
      const response = await request.delete(`${url}/4`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No transaction with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid transaction id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  // todo
  // testen of de statuscode 400 is als het id geen nummer is
  // testen of de statuscode 404 is als de transactie niet bestaat

});
