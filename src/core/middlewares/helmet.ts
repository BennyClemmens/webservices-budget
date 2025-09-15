import koaHelmet from 'koa-helmet';
import type { KoaApplication } from '../../types/koa';

export default function installKoaHelmet(app: KoaApplication) {
  app.use(koaHelmet());
}
