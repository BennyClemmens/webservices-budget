import Koa from 'koa';
import { getLogger } from './core/logging';
import bodyParser from 'koa-bodyparser';
import installRest from './rest/parent.rest';
import config from 'config';
import koaCors from '@koa/cors';
import { initializeData } from './data';

const CORS_ORIGINS = config.get<string[]>('cors.origins');
const CORS_MAX_AGE = config.get<number>('cors.maxAge');

async function main() {
  const app = new Koa();

  app.use(
    koaCors({
      origin: (context) => {
        if (CORS_ORIGINS.indexOf(context.request.header.origin!) !== -1) {
          return context.request.header.origin!;
        }
        // Not a valid domain at this point, let's return the first valid as we should return a string
        return CORS_ORIGINS[0] || '';
      },
      allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
      maxAge: CORS_MAX_AGE,
    }),
  );

  app.use(bodyParser());

  await initializeData();

  installRest(app);
  // je zou hier nog andere interfaces voor andere clients kunnen bij installeren die dezelfde servicelaag aanspreken

  app.listen(9000, () => {
    getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
  });
}

main();

