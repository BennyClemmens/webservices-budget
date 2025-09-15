import type { KoaApplication } from '../types/koa';
import installCors from './middlewares/cors';
import installRequestLogger from './middlewares/requestlogger';
import installBodyparser from './middlewares/bodyparser';
import installErrorconverter from './middlewares/errorconverter';
import install404converter from './middlewares/404converter';
import installKoaHelmet from './middlewares/helmet';

export default function installMiddlewares(app: KoaApplication) {
  installCors(app);
  installRequestLogger(app);
  installBodyparser(app);
  installKoaHelmet(app);
  installErrorconverter(app);
  install404converter(app);
}
