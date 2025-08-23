import type { KoaApplication } from '../types/koa';
import koaCors from '@koa/cors';
import config from 'config';
import bodyParser from 'koa-bodyparser';

const CORS_ORIGINS = config.get<string[]>('cors.origins');
const CORS_MAX_AGE = config.get<number>('cors.maxAge');

export default function installMiddlewares(app: KoaApplication) {
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
  
}
