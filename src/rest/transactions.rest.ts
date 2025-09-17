import Router from '@koa/router';
import * as transactionService from '../service/transaction.service';
import type { BudgetAppContext, BudgetAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetAllTransactionsReponse,
  GetTransactionByIdResponse,
  UpdateTransactionRequest,
  UpdateTransactionResponse,
} from '../types/transaction';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

const getAllTransactions = async (context: KoaContext<GetAllTransactionsReponse>) => {
  context.body = {
    items: await transactionService.getAll(
      context.state.session.userId,
      context.state.session.roles,
    ), // geen arrays returnen in http response!
    // perhaps check pagination as an extra ...
  };
};
getAllTransactions.validationScheme = null;

const getTransactionById = async (context: KoaContext<GetTransactionByIdResponse, IdParams>) => {
  context.body = await transactionService.getById(
    context.params.id,
    context.state.session.userId,
    context.state.session.roles,
  );
  // 204 no content if not found...
};
getTransactionById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const createTransaction = async (context: KoaContext<CreateTransactionResponse, void, CreateTransactionRequest>) => {
  const newTransaction = await transactionService.create({
    ...context.request.body,
    userId: context.state.session.userId,
  });
  context.body = newTransaction; // zodat gebruiker het resultaat ziet ...
  context.status = 201;
};
createTransaction.validationScheme = {
  body: {
    amount: Joi.number().invalid(0),
    date: Joi.date().iso().less('now'),
    placeId: Joi.number().integer().positive(),
    //userId: Joi.number().integer().positive(),
  },
};

const updateTransactionById = async (
  context: KoaContext<UpdateTransactionResponse, IdParams, UpdateTransactionRequest>) => {
  context.body = await transactionService.updateById(
    context.params.id,
    {
      ...context.request.body,
      userId: context.state.session.userId,
    },
  );
};
updateTransactionById.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    amount: Joi.number().invalid(0),
    date: Joi.date().iso().less('now'),
    placeId: Joi.number().integer().positive(),
    //userId: Joi.number().integer().positive(),
  },
};

const deleteTransactionById = async (context: KoaContext<void, IdParams>) => {
  await transactionService.deleteById(context.params.id,context.state.session.userId);
  context.status = 204;
};
deleteTransactionById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/transactions',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllTransactions.validationScheme), getAllTransactions);
  router.get('/:id', validate(getTransactionById.validationScheme), getTransactionById);
  router.post('/', validate(createTransaction.validationScheme), createTransaction);
  router.put('/:id', validate(updateTransactionById.validationScheme), updateTransactionById);
  router.delete('/:id', validate(deleteTransactionById.validationScheme),deleteTransactionById);

  parent.use(router.routes()).use(router.allowedMethods());
};
