import {type  KoaApplication } from '../../types/koa';

export default function install404converter(app: KoaApplication) {
  app.use(async (ctx, next) => {
    await next();

    if (ctx.status === 404) {
      ctx.status = 404;
      ctx.body = {
        code: 'NOT_FOUND',
        message: `Unknown resource: ${ctx.url}`,
      };
    }
  });
}
