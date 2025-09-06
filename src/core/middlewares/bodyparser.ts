import bodyParser from 'koa-bodyparser';
import type { KoaApplication } from '../../types/koa';

export default function installBodyparser(app: KoaApplication) {
  app.use(bodyParser());
}
