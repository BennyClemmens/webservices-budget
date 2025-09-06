import type { KoaApplication } from '../types/koa';
import installCors from './middlewares/cors';
import installRequestLogger from './middlewares/requestlogger';
import installBodyparser from './middlewares/bodyparser';

export default function installMiddlewares(app: KoaApplication) {
  installCors(app);
  installRequestLogger(app);
  installBodyparser(app);
}
