import type { KoaApplication } from './koa';

export interface BudgetServer {
  getApp(): KoaApplication;
  start(): Promise<void>;
  stop(): Promise<void>;
}
