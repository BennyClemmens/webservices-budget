import supertest from 'supertest';
import createServer from '../../src/core/createServer';
import type { BudgetServer } from '../../src/types/server';
import { prisma } from '../../src/data';
import { TESTDATA } from '../../src/data/mock_test_data';
import * as seedHelper from '../aa_seed/seed.help';

describe('Users suite', () => {
  let budgetServer: BudgetServer;
  let request: supertest.Agent;

  beforeAll(async () => {
    budgetServer = await createServer();
    request = supertest(budgetServer.getApp().callback());
  });

  afterAll(async () => {
    budgetServer.stop();
  });

  const url = '/api/users';

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

    it('should 200 and return all users', async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(TESTDATA.u.length);
      expect(response.body.items).toEqual(
        expect.arrayContaining(TESTDATA.u),
      );
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe('GET /api/user/:id', () => {
    beforeAll(async () => {
      await seedHelper.trunctateTables();
      await seedHelper.seedData(prisma.user, TESTDATA.u, 'users');
      await seedHelper.seedData(prisma.place, TESTDATA.p, 'places');
      await seedHelper.seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {
      await seedHelper.emptyTables();
    });

    it('should 200 and return the requested user', async () => {
      const uId = 1;
      const user = TESTDATA.u.find((u) => u.id === uId);
      if (!user)
        throw new Error(`TESTDATA.u does not contain id ${uId}`);
      const response = await request.get(`${url}/${uId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(user);
    });

    it('should 404 with not existing user', async () => {
      const response = await request.get(`${url}/123`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No user with this id 123 exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid user id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });

  describe('POST /api/users', () => {
    beforeAll(async () => {
      await seedHelper.trunctateTables();
      await seedHelper.seedData(prisma.user, TESTDATA.u, 'users');
      // await seedHelper.seedData(prisma.place, TESTDATA.p, 'places');
      // await seedHelper.seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {
      await seedHelper.emptyTables();
    });

    it('should 201,return the created user and have it added in the database', async () => {
      const userToInsert = {
        name: 'Pipi',
        surname: 'Langkous',
      };
      const response = await request.post(url).send(userToInsert);

      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBeTruthy();
      const recievedId: number = response.body.id;
      expect(response.body.name).toBe(userToInsert.name);
      expect(response.body.surname).toBe(userToInsert.surname);

      const check = await request.get(`${url}/${recievedId}`);
      expect(check.statusCode).toBe(200);
      expect(check.body.id).toEqual(recievedId);
      expect(check.body.name).toEqual(userToInsert.name);
      expect(check.body.surname).toEqual(userToInsert.surname);
      //expect(check.body.transactions).toEqual([]);
    });
  });

  describe('PUT /api/users/:id', () => {
    beforeAll(async () => {
      await seedHelper.trunctateTables();
      await seedHelper.seedData(prisma.user, TESTDATA.u, 'users');
      await seedHelper.seedData(prisma.place, TESTDATA.p, 'places');
      await seedHelper.seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {
      await seedHelper.emptyTables();
    });

    it('should 200,return the updated user and have it changed in the database', async () => {
      const uId = 1;
      const user = TESTDATA.u.find((u) => u.id === uId);
      if (!user)
        throw new Error(`TESTDATA.u does not contain id ${uId}`);
      const userToUpdate = {
        name: 'Changed name',
        surname: 'Changed surname',
      };
      const response = await request.put(`${url}/${uId}`).send(userToUpdate);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: uId,
        name: userToUpdate.name,
        surname: userToUpdate.surname,
      });

      const check = await request.get(`${url}/${uId}`);
      expect(check.statusCode).toBe(200);
      expect(check.body.id).toEqual(uId);
      expect(check.body.name).toEqual(userToUpdate.name);
      expect(check.body.surname).toEqual(userToUpdate.surname);
    });
  });

  describe('DELETE /api/users/:id', () => {
    beforeAll(async () => {
      await seedHelper.trunctateTables();
      await seedHelper.seedData(prisma.user, TESTDATA.u, 'users');
      //await seedHelper.seedData(prisma.place, TESTDATA.p, 'places');
      //await seedHelper.seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {
      await seedHelper.emptyTables();
    });

    it('should 204 and return nothing', async () => {
      const uId = 1;
      const user = TESTDATA.u.find((u) => u.id === uId);
      if (!user)
        throw new Error(`TESTDATA.u does not contain id ${uId}`);
      const response = await request.delete(`${url}/${uId}`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});

      //TODO
      //check if getbyid this id gets 404 (or nothing?)
      //error for constraint!
    });

    it('should 404 with not existing user', async () => {
      const response = await request.delete(`${url}/123`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No user with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });
  });

  //TODO: get transactions by user id?
});
