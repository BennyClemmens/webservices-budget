import Router from '@koa/router';
import * as userService from '../service/user.service';
import * as transactionService from '../service/transaction.service';
import type { Context } from 'koa';

const getAllUsers = async (ctx: Context) => {
  const users = userService.getAll();
  ctx.body = {
    items: users,
  };
};

const getUserById = async (ctx: Context) => {
  const user = userService.getById(Number(ctx.params.id));
  ctx.body = user;
};

const getTransactionsByUserId = async (context: Context) => {
  const transactions = await transactionService.getTransactionsByUserId(Number(context.params.id));
  context.body = {
    items: transactions,
  };
};

const createUser = async (ctx: Context) => {
  const user = userService.create(ctx.request.body!);
  ctx.status = 201;  // new
  ctx.body = user;
};

const updateUserById = async (ctx: Context) => {
  const user = userService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = user;
};

const deleteUserById = async (ctx: Context) => {
  userService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: Router) => {
  const router = new Router({
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
