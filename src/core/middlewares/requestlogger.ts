import type { KoaApplication } from '../../types/koa';
import { getLogger } from '../../core/logging';
import config from 'config';

const NODE_ENV: string = config.get<string>('env');
const isDev: boolean = (NODE_ENV === 'development');

function stateEmoji(state: number): string {
  return (!isDev) ? '' :
    (state >= 500) ? '💀 ' :
      (state >= 400) ? '❌ ' :
        (state >= 300) ? '🔀 ' :
          (state >= 200) ? '✅ ' : '🔄 ';
};

export default function installRequestLogger(app: KoaApplication) {
  app.use(async (ctx, next) => {
    let logPrefix: string = isDev ? '⏩' : 'REQUEST';
    const start: number = Date.now();
    getLogger().info(`${logPrefix} ${ctx.method} ${ctx.url}`);

    await next();

    const ms: number = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    logPrefix = isDev ? '⏪' : 'RESPONSE';
    getLogger().info(
      `${logPrefix} ${stateEmoji(ctx.status)}${ctx.status} (${ctx.method} ${ctx.url}) - ${ms}ms`,
    );
  });
}
