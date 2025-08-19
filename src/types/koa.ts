import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';

export interface BudgetAppState {
  //later: session information (chapter 7)
  //who is logged on and such
}

export interface BudgetAppContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown> { // order matters (volgens frequentie gebruik), ik had ook P, R, Q kunnnen gebruiken ...
  //later: define onw types for request body, query parameters, url
  //but i don't know the type so i need generics
  request: {
    body: RequestBody;
    query: Query;
  },
  params: Params;//url params
}

//a type for the application, with our own state and context
export interface KoaApplication extends Application<BudgetAppState, BudgetAppContext> {}

//similar: a type for the router, with our own state and context
export interface KoaRouter extends Router<BudgetAppState, BudgetAppContext> {}

//een eigen koa context type
export type KoaContext<
  ResponseBody = unknown,
  P = unknown,
  R = unknown,
  Q = unknown,
> =
  ParameterizedContext<BudgetAppState, BudgetAppContext<P, R, Q>, ResponseBody>
  // & {
  //   request: {
  //     body?: RequestBody;
  //     query: Query;
  //   };
  //   params: Params;
  // }
  ;
