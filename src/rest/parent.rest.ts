import Router from '@koa/router';
import type Application from 'koa';
import installHealthRouter from './health.rest';
import installTransactionsRouter from './transactions.rest';
import installPlacesRouter from './places.rest';
import installUsersRouter from './users.rest';

export default (app: Application) => {
  const parentRouter = new Router({
    prefix: '/api',
  });

  installHealthRouter(parentRouter);
  installTransactionsRouter(parentRouter);
  installPlacesRouter(parentRouter);
  installUsersRouter(parentRouter);
  
  app.use(parentRouter.routes())
    .use(parentRouter.allowedMethods());
};
