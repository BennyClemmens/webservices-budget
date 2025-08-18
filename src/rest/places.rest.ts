import Router from '@koa/router';
import * as placeService from '../service/place.service';
import * as transactionService from '../service/transaction.service';
import type { Context } from 'koa';
import { getLogger } from '../core/logging';

const getAllPlaces = async (ctx: Context) => {
  getLogger().debug(`${ctx.request.method} ${ctx.request.url}`);
  const places = await placeService.getAll();
  ctx.body = {
    items: places,
  };
};

const getPlaceById = async (ctx: Context) => {
  const place = await placeService.getById(Number(ctx.params.id));
  ctx.body = place;
};

const getTransactionsByPlaceId = async (context: Context) => {
  const transactions = await transactionService.getTransactionsByPlaceId(Number(context.params.id));
  context.body = {
    items: transactions,
  };
};

const createPlace = async (ctx: Context) => {
  const place = await placeService.create(ctx.request.body!);
  ctx.status = 201;
  ctx.body = place;
};

const updatePlaceById = async (ctx: Context) => {
  const place = await placeService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = place;
  // status?
};

const deletePlaceById = async (ctx: Context) => {
  await placeService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: Router) => {
  const router = new Router({
    prefix: '/places',
  });

  router.get('/', getAllPlaces);
  router.get('/:id', getPlaceById);
  router.get('/:id/transactions', getTransactionsByPlaceId);
  router.post('/', createPlace);
  router.put('/:id', updatePlaceById);
  router.delete('/:id', deletePlaceById);

  parent.use(router.routes()).use(router.allowedMethods());
};
