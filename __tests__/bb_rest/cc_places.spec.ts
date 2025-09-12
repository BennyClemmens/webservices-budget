// import supertest from 'supertest';
// import createServer from '../../src/createServer';
// import type { Server } from '../../src/createServer';
// import { prisma } from '../../src/data';

import supertest from 'supertest';
import createServer from '../../src/core/createServer';
import type { BudgetServer } from '../../src/types/server';
import { prisma } from '../../src/data';
import { TESTDATA } from '../../src/data/mock_test_data';
import * as seedHelper from '../aa_seed/seed.help';

describe('Places suite', () => {
  let budgetServer: BudgetServer;
  let request: supertest.Agent;

  beforeAll(async () => {
    budgetServer = await createServer();
    request = supertest(budgetServer.getApp().callback());
  });

  afterAll(async () => {
    budgetServer.stop();
  });

  const url: string = '/api/places';

  describe(`GET ${url}`, () => {
    beforeAll(async () => {
      await seedHelper.trunctateTables();
      await seedHelper.seedData(prisma.user, TESTDATA.u, 'users');
      await seedHelper.seedData(prisma.place, TESTDATA.p, 'places');
      await seedHelper.seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {
      await seedHelper.emptyTables();
    });

    it('should 200 and return all places', async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(TESTDATA.p.length);
      expect(response.body.items).toEqual(
        // expect.arrayContaining(
        //   TESTDATA.p.map((p) => ({
        //     id: p.id,
        //     name: p.name,
        //   })),
        // )
        expect.arrayContaining(TESTDATA.p),
      );
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe(`GET ${url}/:id`, () => {
    beforeAll(async () => {
      await seedHelper.trunctateTables();
      await seedHelper.seedData(prisma.user, TESTDATA.u, 'users');
      await seedHelper.seedData(prisma.place, TESTDATA.p, 'places');
      await seedHelper.seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {
      await seedHelper.emptyTables();
    });

    it('should 200 and return the requested place', async () => {
      const pId = 1;
      const place = TESTDATA.p.find((p) => p.id === pId);
      if (!place)
        throw new Error(`TESTDATA.p does not contain id ${pId}`);
      const response = await request.get(`${url}/${pId}`);
      // console.log(response.body);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: place.id,
        name: place.name,
        rating: place.rating,
        transactions: TESTDATA.t
          .filter((t) => t.place_id === pId)
          .map((t) => ({
            id: t.id,
            amount: t.amount,
            date: new Date(t.date).toISOString(), // prisma geeft string, TESTDATA waarschijnlijk Date object
            place: {
              id: place.id,
              name: place.name,
              rating: place.rating,
            },
            user: {
              id: TESTDATA.u.find((u) => u.id === t.user_id)!.id,
              name: TESTDATA.u.find((u) => u.id === t.user_id)!.name,
              surname: TESTDATA.u.find((u) => u.id === t.user_id)!.surname,
            },
          })),
      });

    });

    it('should 404 when requesting not existing place', async () => {
      const response = await request.get(`${url}/200`);

      expect(response.statusCode).toBe(404);

      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'There is no place with id 200',
      });

      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid place id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });  

  describe(`POST ${url}`, () => {
    beforeAll(async () => {
      await seedHelper.trunctateTables();
      // await seedHelper.seedData(prisma.user, TESTDATA.u, 'users');
      await seedHelper.seedData(prisma.place, TESTDATA.p, 'places');
      // await seedHelper.seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {
      await seedHelper.emptyTables();
    });

    it('should 201,return the created place and have it added in the database', async () => {
      const placeToInsert = {
        name: 'Lovely place',
        rating: 5,
      };
      const response = await request.post(url).send(placeToInsert);

      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBeTruthy();
      const recievedId: number = response.body.id;
      expect(response.body.name).toBe(placeToInsert.name);
      expect(response.body.rating).toBe(placeToInsert.rating);
      // console.log(response.body);
      
      const check = await request.get(`${url}/${recievedId}`);
      // console.log(check.body);
      expect(check.statusCode).toBe(200);
      expect(check.body.id).toEqual(recievedId);
      expect(check.body.name).toEqual(placeToInsert.name);
      expect(check.body.rating).toEqual(placeToInsert.rating);
      expect(check.body.transactions).toEqual([]);
    });

    it('should 400 for duplicate place name', async () => {
      const response = await request.post(url)
        .send({ name: 'Lovely place' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'A place with this name already exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing name', async () => {
      const response = await request.post(url)
        .send({ rating: 3 });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 400 when rating lower than one', async () => {
      const response = await request.post(url)
        .send({
          name: 'The wrong place',
          rating: 0,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating higher than five', async () => {
      const response = await request.post(url)
        .send({
          name: 'The wrong place',
          rating: 6,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating is a decimal', async () => {
      const response = await request.post(url)
        .send({
          name: 'The wrong place',
          rating: 3.5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });
  });

  describe('PUT /api/places/:id', () => {
    beforeAll(async () => {
      await seedHelper.trunctateTables();
      await seedHelper.seedData(prisma.user, TESTDATA.u, 'users');
      await seedHelper.seedData(prisma.place, TESTDATA.p, 'places');
      await seedHelper.seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {
      await seedHelper.emptyTables();
    });

    it('should 200,return the updated place and have it changed in the database', async () => {
      const pId = 1;
      const place = TESTDATA.p.find((p) => p.id === pId);
      if (!place)
        throw new Error(`TESTDATA.p does not contain id ${pId}`);
      const placeToUpdate = {
        name: 'Changed name',
        rating: 1,
      };
      const response = await request.put(`${url}/${pId}`).send(placeToUpdate);
      expect(response.statusCode).toBe(200);
            
      expect(response.body).toEqual({
        id: pId,
        name: placeToUpdate.name,
        rating: placeToUpdate.rating,
        //transactions: request.body.transactions,
      });

      const check = await request.get(`${url}/${pId}`);
      expect(check.statusCode).toBe(200);
      expect(check.body.id).toEqual(pId);
      expect(check.body.name).toEqual(placeToUpdate.name);
      expect(check.body.rating).toEqual(placeToUpdate.rating);
    });

    it('should 400 for duplicate place name', async () => {
      const response = await request.put(`${url}/2`)
        .send({
          name: 'Changed name',
          rating: 3,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'A place with this name already exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing name', async () => {
      const response = await request.put(`${url}/1`)
        .send({ rating: 3 });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 400 when missing rating', async () => {
      const response = await request.put(`${url}/1`)
        .send({ name: 'The name' });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating lower than one', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'The wrong place',
          rating: 0,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating higher than five', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'The wrong place',
          rating: 6,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating is a decimal', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'The wrong place',
          rating: 3.5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });
  });

  describe('DELETE /api/places/:id', () => {
    beforeAll(async () => {
      await seedHelper.trunctateTables();
      //await seedHelper.seedData(prisma.user, TESTDATA.u, 'users');
      await seedHelper.seedData(prisma.place, TESTDATA.p, 'places');
      //await seedHelper.seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {
      await seedHelper.emptyTables();
    });

    it('should 204 and return nothing', async () => {
      const pId = 1;
      const place = TESTDATA.p.find((p) => p.id === pId);
      if (!place)
        throw new Error(`TESTDATA.p does not contain id ${pId}`);
      const response = await request.delete(`${url}/${pId}`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});

      //TODO
      //check if getbyid this id gets 404 (or nothing?)
      //error for constraint!
    });

    it('should 404 with not existing place', async () => {
      const response = await request.delete(`${url}/200`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No place with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid place id', async () => {
      const response = await request.delete(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  // describe('GET /api/places/:id/transactions', () => {

  //   beforeAll(async () => {
  //     await prisma.place.createMany({ data: data.places });
  //     await prisma.user.createMany({ data: data.users });
  //     await prisma.transaction.createMany({ data: data.transactions });
  //   });

  //   afterAll(async () => {
  //     await prisma.transaction.deleteMany({ where: { id: { in: dataToDelete.transactions } } });
  //     await prisma.place.deleteMany({ where: { id: { in: dataToDelete.places } } });
  //     await prisma.user.deleteMany({ where: { id: { in: dataToDelete.users } } });
  //   });

  //   it('should 200 and return the transaction of the given place', async () => {
  //     const response = await request.get(`${url}/1/transactions`);

  //     expect(response.statusCode).toBe(200);
  //     expect(response.body.items.length).toBe(3);
  //     expect(response.body.items).toEqual(expect.arrayContaining([{
  //       id: 2,
  //       amount: -220,
  //       date: '2021-05-08T18:00:00.000Z',
  //       place: {
  //         id: 1,
  //         name: 'Loon',
  //         rating: 3,
  //       },
  //       user: {
  //         id: 1,
  //         name: 'Test User',
  //       },
  //     }, {
  //       id: 3,
  //       amount: -74,
  //       date: '2021-05-21T12:30:00.000Z',
  //       place: {
  //         id: 1,
  //         name: 'Loon',
  //         rating: 3,
  //       },
  //       user: {
  //         id: 1,
  //         name: 'Test User',
  //       },
  //     }]));
  //   });
  // });

  //   it('should 400 with invalid place id', async () => {
  //   const response = await request.get(`${url}/invalid/transactions`);

  //   expect(response.statusCode).toBe(400);
  //   expect(response.body.code).toBe('VALIDATION_FAILED');
  //   expect(response.body.details.params).toHaveProperty('id');
  // });
});
