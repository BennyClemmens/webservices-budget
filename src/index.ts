import Koa from 'koa';
import { getLogger } from "./core/logging";

const app = new Koa();

app.use(async (context) => {
  console.log(context);
  context.body = 'Hello World from typescript';
  console.log(context);
});

app.listen(9000, () => {
  getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
});
