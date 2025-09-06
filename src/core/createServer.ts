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
      return new Promise<void>((resolve, reject) => {
        getLogger().debug('> createServer.start()');
        
        const budgetServer = app.listen(9000, () => {
          getLogger().info('🚀 Server listening on http://localhost:9000');
          getLogger().debug('< resolving createServer.start()');
          resolve();
        });

        budgetServer.on('error', (err) => {
          getLogger().error('❌ Failed to start server on http://localhost:9000');
          reject(err); // afgehandeld in src/index.ts
        });
      });
    },

    async stop() {
      getLogger().debug('> createServer.stop(): app.removeAllListeners();');
      app.removeAllListeners();
      getLogger().debug('> createServer.stop(): await shutdownData();');
      await shutdownData();
      getLogger().debug('< createServer.stop()');
    },
  };

  return serverFunctions;
}
