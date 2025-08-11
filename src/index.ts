import Koa from 'koa';
import { getLogger } from './core/logging';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import * as transactionService from './service/transaction.service';

const app = new Koa();

app.use(bodyParser());

const router = new Router();

router.get('/api/transactions', async (context) => {
  context.body = {
    items: transactionService.getAll(), // geen arrays returnen in http response!
    // perhaps check pagination as an extra ...
  };
});

router.post('/api/transactions', async (context) => {
  const newTransaction = transactionService.create({
    ...context.request.body, // hierin zit de transaction (amount?)
    date: new Date(context.request.body.date),
    placeId: Number(context.request.body.placeId), // temp solution untill validation
    userId: Number(context.request.body.userId), // temp solution untill validation
  });
  context.body = newTransaction; // zodat gebruiker het resultaat ziet ...
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(9000, () => {
  getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
});
