import Router from '@koa/router';
import * as placeService from '../service/place.service';
import * as transactionService from '../service/transaction.service';
import type { Context } from 'koa';

const getAllPlaces = async (ctx: Context) => {
  const places = placeService.getAll();
  ctx.body = {
    items: places,
  };
};

const getPlaceById = async (ctx: Context) => {
  const place = placeService.getById(Number(ctx.params.id));
  ctx.body = place;
};

const getTransactionsByPlaceId = async (context: Context) => {
  const transactions = await transactionService.getTransactionsByPlaceId(Number(context.params.id));
  context.body = {
    items: transactions,
  };
};

const createPlace = async (ctx: Context) => {
  const place = placeService.create(ctx.request.body!);
  ctx.status = 201;  // new
  ctx.body = place;
};

const updatePlaceById = async (ctx: Context) => {
  const place = placeService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = place;
};

const deletePlaceById = async (ctx: Context) => {
  placeService.deleteById(Number(ctx.params.id));
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
