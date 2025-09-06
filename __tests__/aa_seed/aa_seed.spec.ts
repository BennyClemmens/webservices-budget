import { prisma, initializeData, shutdownData } from '../../src/data';
import { TESTDATA } from '../../src/data/mock_test_data';
import * as seedHelper from './seed.help';

describe('Seeder functions', () => {
  //let budgetServer: BudgetServer;

  beforeAll(async () => {
    //budgetServer = await createServer();
    await initializeData();
  });

  afterAll(async () => {
    //budgetServer.stop();  // to close database connection ( overkill for 'await shutdownData()';)
    await shutdownData();
  });

  describe('Raw content of all database tables', () => {

    beforeAll(async () => { // or EACH ?
      await seedHelper.trunctateTables();
      await seedHelper.seedData(prisma.user, TESTDATA.u, 'users');
      await seedHelper.seedData(prisma.place, TESTDATA.p, 'places');
      await seedHelper.seedData(prisma.transaction, TESTDATA.t, 'transactions');
    });

    afterAll(async () => {  // or EACH?
      await seedHelper.emptyTables();
    });

    it('should have seeded the places table with TESTDATA.t', async () => {
      expect(await prisma.place.count()).toBe(TESTDATA.p.length);
      expect(await prisma.place.findMany()).toEqual(expect.arrayContaining(TESTDATA.p));
    });

    it('should have seeded the users table with TESTDATA.u', async () => {
      expect(await prisma.user.count()).toBe(TESTDATA.u.length);
      expect(await prisma.user.findMany()).toEqual(expect.arrayContaining(TESTDATA.u));
    });

    it('should have seeded the transaction table with TESTDATA.t', async () => {
      expect(await prisma.transaction.count()).toBe(TESTDATA.t.length);
      expect(await prisma.transaction.findMany()).toEqual(expect.arrayContaining(TESTDATA.t));
    });

    it('should have valid references for users and places', async() => {
      const uIds = new Set((await prisma.user.findMany()).map((u) => u.id));
      const pIds = new Set((await prisma.place.findMany()).map((p) => p.id));
      let referenced: boolean = true;
      for (const t of (await prisma.transaction.findMany())) {
        if (! (uIds.has(t.user_id) && pIds.has(t.place_id))) {
          referenced = false;
          return;
        }
      } // for loop: more readable then a oneliner ...
      expect(referenced).toBeTruthy();
    });
  });
});
