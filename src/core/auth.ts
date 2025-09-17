// src/core/auth.ts
import type { Next } from 'koa';
import type { KoaContext } from '../types/koa';
import * as userService from '../service/user.service';
import config from 'config';

const AUTH_MAX_DELAY = config.get<number>('auth.maxDelay');

// a middleware
export const requireAuthentication = async (ctx: KoaContext, next: Next) => {
  const { authorization } = ctx.headers;

  ctx.state.session = await userService.checkAndParseSession(authorization);

  return next();
};

// returns a middleware
export const makeRequireRole =
  (role: string) => async (ctx: KoaContext, next: Next) => {
    const { roles = [] } = ctx.state.session;

    userService.checkRole(role, roles);

    return next();
  };

export const authDelay = async (_: KoaContext, next: Next) => {
  await new Promise((resolve) => {
    const delay = Math.round(Math.random() * AUTH_MAX_DELAY);
    setTimeout(resolve, delay);
  });
  return next();
};
