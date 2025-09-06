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

const getAllTransactions = async (context: KoaContext<GetAllTransactionsReponse>) => {
  context.body = {
    items: await transactionService.getAll(), // geen arrays returnen in http response!
    // perhaps check pagination as an extra ...
  };
};

const getTransactionById = async (context: KoaContext<GetTransactionByIdResponse, IdParams>) => {
  context.body = await transactionService.getById(Number(context.params.id));
  // 204 no content if not found...
};

const createTransaction = async (context: KoaContext<CreateTransactionResponse, void, CreateTransactionRequest>) => {
  const newTransaction = await transactionService.create({
    ...context.request.body, // hierin zit de transaction (amount?)
    date: new Date(context.request.body.date),
    placeId: Number(context.request.body.placeId), // temp solution untill validation
    userId: Number(context.request.body.userId), // temp solution untill validation
  });
  context.body = newTransaction; // zodat gebruiker het resultaat ziet ...
  context.status = 201;
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

  router.get('/', getAllTransactions);
  router.get('/:id', getTransactionById);
  router.post('/', createTransaction);
  router.put('/:id', updateTransactionById);
  router.delete('/:id', deleteTransactionById);

  //hang mijn router onder de parent
  parent.use(router.routes()).use(router.allowedMethods());
};
