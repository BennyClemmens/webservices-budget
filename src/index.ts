import Koa from 'koa';
import { getLogger } from './core/logging';
import bodyParser from 'koa-bodyparser';

const app = new Koa();

app.use(bodyParser()); // needs to before first use or body is not parsed => undefined

app.use(async (context) => {
  getLogger().info(JSON.stringify(context.request));
  getLogger().info(JSON.stringify(context.request.body));
  if (
    context.request.method === 'GET' && //
    context.request.url === '/api/transactions' // WERKT ENKEL ZONDER /!
  ) {
    context.body =
      '[{"user": "Benjamin", "amount": 100, "place": "Irish Pub", "date": "2021-08-15" }]'; // json => later
  } else {
    context.body = 'Hello World from TypeScript';
  }
});

app.listen(9000, () => {
  getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
});
