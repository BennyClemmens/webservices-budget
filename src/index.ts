import Koa from 'koa';
import { getLogger } from './core/logging';

const app = new Koa();

app.use(async (context) => {
  getLogger().info(JSON.stringify(context.request));
  if (
    context.request.method === 'GET' && //
    context.request.url === '/api/transactions' // WERKT ENKEL ZONDER /!
  ) {
    // const body = {results: [{'user': 'Benjamin', 'amount': 100, 'place': 'Irish Pub', 'date': '2021-08-15' }]};
    // context.response.type = 'json';
    // context.body = body;
    context.body =
      '[{"user": "Benjamin", "amount": 100, "place": "Irish Pub", "date": "2021-08-15" }]'; // json => later
  } else {
    context.body = 'Hello World from TypeScript';
  }
});

app.listen(9000, () => {
  getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
});
