import type { KoaApplication } from '../../types/koa';
import { getLogger } from '../../core/logging';
import config from 'config';
import ServiceError from '../serviceError';

const NODE_ENV: string = config.get<string>('env');

export default function installErrorconverter(app: KoaApplication) {
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error: any) {
      getLogger().error('Error occured while handling a request', { error });

      let statusCode = error.status || 500;
      const errorBody = {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        // Do not expose the error message in production
        message:
        error.message || 'Unexpected error occurred. Please try again later.',
        details: error.details,
        stack: NODE_ENV !== 'production' ? error.stack : undefined,
      };

      // 👇 7
      if (error instanceof ServiceError) {
        errorBody.message = error.message;

        if (error.isNotFound) {
          statusCode = 404;
        }

        if (error.isValidationFailed) {
          statusCode = 400;
        }

        if (error.isUnauthorized) {
          statusCode = 401;
        }

        if (error.isForbidden) {
          statusCode = 403;
        }

        if (error.isConflict) {
          statusCode = 409;
        }
      }

      // 👇 8
      ctx.status = statusCode;
      ctx.body = errorBody;
    }
  });
}
