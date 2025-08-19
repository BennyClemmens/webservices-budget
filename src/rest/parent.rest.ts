import Router from '@koa/router';
import type { BudgetAppContext, BudgetAppState, KoaApplication } from '../types/koa';
import installHealthRouter from './health.rest';
import installTransactionsRouter from './transactions.rest';
import installPlacesRouter from './places.rest';
import installUsersRouter from './users.rest';

export default (app: KoaApplication) => {
  const parentRouter = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/api',
  });

  installHealthRouter(parentRouter);
  installTransactionsRouter(parentRouter);
  installPlacesRouter(parentRouter);
  installUsersRouter(parentRouter);
  
  app.use(parentRouter.routes())
    .use(parentRouter.allowedMethods());
};
