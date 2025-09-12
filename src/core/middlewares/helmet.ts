import koaHelmet from 'koa-helmet';
import type { KoaApplication } from '../../types/koa';

export default function installKoa(app: KoaApplication) {
  app.use(koaHelmet());
}
