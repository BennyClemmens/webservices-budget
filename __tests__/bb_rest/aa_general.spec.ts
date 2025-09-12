import supertest from 'supertest';
import createServer from '../../src/core/createServer';
import type { BudgetServer } from '../../src/types/server';

describe('General', () => {
  const url = '/invalid';
  let server: BudgetServer;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should return 404 when accessing invalid url', async () => {
    const response = await request.get(url);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      code: 'NOT_FOUND',
      message: `Unknown resource: ${url}`,
    });
  });
});
