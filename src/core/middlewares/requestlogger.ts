import type { KoaApplication } from '../../types/koa';
import { getLogger } from '../../core/logging';
import config from 'config';

const NODE_ENV = config.get<string>('env');

export default function installRequestLogger(app: KoaApplication) {
  app.use(async (ctx, next) => {
    let directionEmoji = (NODE_ENV === 'development') ? '⏩' : 'REQUEST';
    
    const start = Date.now();
    getLogger().info(`${directionEmoji} ${ctx.method} ${ctx.url}`);

    await next();

    const ms = Date.now() - start;
    const stateEmoji = (() => {
      if (NODE_ENV !== 'development') return '';
      if (ctx.status >= 500) return '💀 ';
      if (ctx.status >= 400) return '❌ ';
      if (ctx.status >= 300) return '🔀 ';
      if (ctx.status >= 200) return '✅ ';
      return '🔄 ';
    })();

    directionEmoji = (NODE_ENV === 'development') ? '⏪' : 'RESPONSE';
    getLogger().info(
      `${directionEmoji} ${stateEmoji}${ctx.status} (${ctx.method} ${ctx.url}) - ${ms}ms`,
    );
  });
}
