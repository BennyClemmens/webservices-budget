import Router from '@koa/router';
import type Application from 'koa';
import installHealthRouter from './health.rest';
import installTransactionRouter from './transaction.rest';

export default (app: Application) => {
  const parentRouter = new Router({
    prefix: '/api',
  });

  installHealthRouter(parentRouter);
  installTransactionRouter(parentRouter);
  
  app.use(parentRouter.routes())
    .use(parentRouter.allowedMethods());
};
