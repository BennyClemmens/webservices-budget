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
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

const getAllPlaces = async (ctx: KoaContext<GetAllPlacesResponse>) => {
  getLogger().debug(`${ctx.request.method} ${ctx.request.url}`);
  const places: Place[] = await placeService.getAll();
  ctx.status = 200;
  ctx.body = {
    items: places,
  };
};
getAllPlaces.validationScheme = null;

const getPlaceById = async (ctx: KoaContext<GetPlaceByIdResponse, IdParams>) => {
  const place = await placeService.getById(Number(ctx.params.id));
  ctx.status = 200;
  ctx.body = place;
};
getPlaceById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getTransactionsByPlaceId = async (context: KoaContext<getTransactionsByPlaceIdResponse,IdParams>) => {
  const transactions = await transactionService.getTransactionsByPlaceId(
    context.params.id,
    context.state.session.userId,
  );
  context.status = 200;
  context.body = {
    items: transactions,
  };
};
getTransactionsByPlaceId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const createPlace = async (ctx: KoaContext<CreatePlaceResponse, void, CreatePlaceRequest>) => {
  const place = await placeService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = place;
};
createPlace.validationScheme = {
  body: {
    name: Joi.string().max(255),
    rating: Joi.number().integer().min(1).max(5).optional(),
  },
};

const updatePlaceById = async (ctx: KoaContext<UpdatePlaceResponse, IdParams, UpdatePlaceRequest>) => {
  const place = await placeService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = place;
};
updatePlaceById.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    name: Joi.string().max(255),
    rating: Joi.number().integer().min(1).max(5),
  },
};

const deletePlaceById = async (ctx: KoaContext<void, IdParams>) => {
  await placeService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deletePlaceById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/places',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllPlaces.validationScheme), getAllPlaces);
  router.get('/:id', validate(getPlaceById.validationScheme), getPlaceById);
  router.get('/:id/transactions', validate(getTransactionsByPlaceId.validationScheme), getTransactionsByPlaceId);
  router.post('/', validate(createPlace.validationScheme), createPlace);
  router.put('/:id', validate(updatePlaceById.validationScheme), updatePlaceById);
  router.delete('/:id', validate(deletePlaceById.validationScheme), deletePlaceById);

  parent.use(router.routes()).use(router.allowedMethods());
};
