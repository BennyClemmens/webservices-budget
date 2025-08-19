import Router from '@koa/router';
import * as userService from '../service/user.service';
import * as transactionService from '../service/transaction.service';
import type { BudgetAppContext, BudgetAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateUserRequest,
  CreateUserResponse,
  GetAllUsersResponse,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '../types/user';
import type { getTransactionsByUserIdResponse } from '../types/transaction';
import type { IdParams } from '../types/common';

const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) => {
  const users = await userService.getAll();
  ctx.body = {
    items: users,
  };
};

const getUserById = async (ctx: KoaContext<GetUserByIdResponse, IdParams>) => {
  const user = await userService.getById(Number(ctx.params.id));
  ctx.status = 200;
  ctx.body = user;
};

const getTransactionsByUserId = async (context: KoaContext<getTransactionsByUserIdResponse,IdParams>) => {
  const transactions = await transactionService.getTransactionsByUserId(Number(context.params.id));
  context.body = {
    items: transactions,
  };
};

const createUser = async (ctx: KoaContext<CreateUserResponse, void, CreateUserRequest>) => {
  const user = await userService.create(ctx.request.body!);
  ctx.status = 201;
  ctx.body = user;
};

const updateUserById = async (ctx: KoaContext<UpdateUserResponse, IdParams, UpdateUserRequest>) => {
  const user = await userService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = user;
  ctx.status = 200;
  // status?
};

const deleteUserById = async (ctx: KoaContext<void, IdParams>) => {
  await userService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/users',
  });

  router.get('/', getAllUsers);
  router.get('/:id', getUserById);
  router.get('/:id/transactions', getTransactionsByUserId);
  router.post('/', createUser);
  router.put('/:id', updateUserById);
  router.delete('/:id', deleteUserById);

  parent.use(router.routes()).use(router.allowedMethods());
};
