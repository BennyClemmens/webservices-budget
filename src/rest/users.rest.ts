import Router from '@koa/router';
import * as userService from '../service/user.service';
import * as transactionService from '../service/transaction.service';
import type { BudgetAppContext, BudgetAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  RegisterUserRequest,
  GetAllUsersResponse,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  LoginResponse,
  GetUserRequest,
} from '../types/user';
import type { getTransactionsByUserIdResponse } from '../types/transaction';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
import { authDelay, makeRequireRole, requireAuthentication } from '../core/auth';
import Role from '../core/roles';
import type { Next } from 'koa';

const checkUserId = (ctx: KoaContext<unknown, GetUserRequest>, next: Next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== 'me' && id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,  // of 404 om niet prijs te geven dat we deze kennen ....
      'You are not allowed to view this user\'s information',
      { code: 'FORBIDDEN' },
    );
  }
  return next();
};

const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) => {
  const users = await userService.getAll();
  ctx.body = {
    items: users,
  };
};
getAllUsers.validationScheme = null;

const getUserById = async (ctx: KoaContext<GetUserByIdResponse, GetUserRequest>) => {
  const user = await userService.getById(
    ctx.params.id === 'me' ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.status = 200;
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().valid('me'),
    ), 
  },
};

const getTransactionsByUserId = async (context: KoaContext<getTransactionsByUserIdResponse,IdParams>) => {
  const transactions = await transactionService.getTransactionsByUserId(context.params.id);
  context.body = {
    items: transactions,
  };
};
getTransactionsByUserId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const registerUser = async (ctx: KoaContext<LoginResponse, void, RegisterUserRequest>) => {
  const token: string = await userService.register(ctx.request.body);
  ctx.status = 201;
  ctx.body = { token };
};
registerUser.validationScheme = {
  body: {
    name: Joi.string().max(255),
    surname: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(12).max(128),
  },
};

const updateUserById = async (ctx: KoaContext<UpdateUserResponse, IdParams, UpdateUserRequest>) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body!);
  ctx.body = user;
  ctx.status = 200;
  // status?
};
updateUserById.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    name: Joi.string().max(255),
    surname: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

const deleteUserById = async (ctx: KoaContext<void, IdParams>) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/users',
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/', requireAuthentication, requireAdmin, validate(getAllUsers.validationScheme), getAllUsers);
  router.get(
    '/:id',
    requireAuthentication, validate(getUserById.validationScheme), checkUserId, getUserById);
  router.get(
    '/:id/transactions',
    requireAuthentication,
    validate(getTransactionsByUserId.validationScheme),
    getTransactionsByUserId,
  );
  router.post('/', authDelay, validate(registerUser.validationScheme), registerUser);
  router.put('/:id', requireAuthentication, validate(updateUserById.validationScheme), checkUserId, updateUserById);
  router.delete('/:id', requireAuthentication, validate(deleteUserById.validationScheme), checkUserId, deleteUserById);

  parent.use(router.routes()).use(router.allowedMethods());
};
