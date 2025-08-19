import Router from '@koa/router';
import * as placeService from '../service/place.service';
import * as transactionService from '../service/transaction.service';
import { getLogger } from '../core/logging';
import type { 
  CreatePlaceRequest,
  CreatePlaceResponse,
  GetAllPlacesResponse,
  GetPlaceByIdResponse,
  UpdatePlaceRequest,
  UpdatePlaceResponse,
} from '../types/place';
import type { getTransactionsByPlaceIdResponse } from '../types/transaction';
import type { IdParams } from '../types/common';
import type { BudgetAppContext, BudgetAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type { Place } from '../types/place';

const getAllPlaces = async (ctx: KoaContext<GetAllPlacesResponse>) => {
  getLogger().debug(`${ctx.request.method} ${ctx.request.url}`);
  const places: Place[] = await placeService.getAll();
  ctx.body = {
    items: places,
  };
};

const getPlaceById = async (ctx: KoaContext<GetPlaceByIdResponse, IdParams>) => {
  const place = await placeService.getById(Number(ctx.params.id));
  ctx.body = place;
};

const getTransactionsByPlaceId = async (context: KoaContext<getTransactionsByPlaceIdResponse,IdParams>) => {
  const transactions = await transactionService.getTransactionsByPlaceId(Number(context.params.id));
  context.body = {
    items: transactions,
  };
};

const createPlace = async (ctx: KoaContext<CreatePlaceResponse, void, CreatePlaceRequest>) => {
  const place = await placeService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = place;
};

const updatePlaceById = async (ctx: KoaContext<UpdatePlaceResponse, IdParams, UpdatePlaceRequest>) => {
  const place = await placeService.updateById(Number(ctx.params.id), ctx.request.body);
  ctx.body = place;
  // status?
};

const deletePlaceById = async (ctx: KoaContext<void, IdParams>) => {
  await placeService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
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
