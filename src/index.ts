import Koa from 'koa';
const app = new Koa();

app.use(async (context) => {
  console.log(context);
  context.body = 'Hello World from typescript';
  console.log(context);
});

app.listen(9000);  // shorthand for creating ...
