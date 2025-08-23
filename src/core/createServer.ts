import type { BudgetAppContext, BudgetAppState } from '../types/koa';
import type { BudgetServer } from '../types/server';
import Koa from 'koa';
import { getLogger } from './logging';
import { initializeData, shutdownData } from '../data';
import installMiddlewares from './installMiddlewares';
import installRest from '../rest/parent.rest';

export default async function createServer(): Promise<BudgetServer> {
  const app = new Koa<BudgetAppState, BudgetAppContext>();

  installMiddlewares(app);
  await initializeData();
  installRest(app);

  const serverFunctions: BudgetServer = {
    getApp() {
      return app;
    },

    start() {
      return new Promise<void>((resolve) => {
        app.listen(9000, () => {
          getLogger().info('🚀 Server listening on http://localhost:9000');
          resolve();
        });
      });
    },

    async stop() {
      app.removeAllListeners();
      await shutdownData();
      //getLogger().info('Goodbye! 👋');
    },
  };

  return serverFunctions;
}
