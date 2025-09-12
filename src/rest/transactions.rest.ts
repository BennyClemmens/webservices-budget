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

const getAllTransactions = async (context: KoaContext<GetAllTransactionsReponse>) => {
  context.body = {
    items: await transactionService.getAll(), // geen arrays returnen in http response!
    // perhaps check pagination as an extra ...
  };
};
getAllTransactions.validationScheme = null;

const getTransactionById = async (context: KoaContext<GetTransactionByIdResponse, IdParams>) => {
  context.body = await transactionService.getById(context.params.id);
  // 204 no content if not found...
};
getTransactionById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const createTransaction = async (context: KoaContext<CreateTransactionResponse, void, CreateTransactionRequest>) => {
  const newTransaction = await transactionService.create(context.request.body);
  context.body = newTransaction; // zodat gebruiker het resultaat ziet ...
  context.status = 201;
};
createTransaction.validationScheme = {
  body: {
    amount: Joi.number().invalid(0),
    date: Joi.date().iso().less('now'),
    placeId: Joi.number().integer().positive(),
    userId: Joi.number().integer().positive(),
  },
};

const updateTransactionById = async (
  context: KoaContext<UpdateTransactionResponse, IdParams, UpdateTransactionRequest>) => {
  context.body = await transactionService.updateById(Number(context.params.id), {
    ...context.request.body,
    date: new Date(context.request.body.date),
    placeId: Number(context.request.body.placeId),
    userId: Number(context.request.body.userId),
  });
};

const deleteTransactionById = async (context: KoaContext<void, IdParams>) => {
  await transactionService.deleteById(Number(context.params.id));
  context.status = 204;
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/transactions',
  });

  router.get('/', validate(getAllTransactions.validationScheme), getAllTransactions);
  router.get('/:id', validate(getTransactionById.validationScheme), getTransactionById);
  router.post('/', validate(createTransaction.validationScheme), createTransaction);
  router.put('/:id', updateTransactionById);
  router.delete('/:id', deleteTransactionById);

  //hang mijn router onder de parent
  parent.use(router.routes()).use(router.allowedMethods());
};
