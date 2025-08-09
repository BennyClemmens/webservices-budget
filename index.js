const Koa = require('koa'); // old import style
const app = new Koa();

app.use(async (context, next) => {
  context.body = 'Hello World';
  await next();
});

app.use(async (context, next) => {
  console.log(context)
  return next; // no use to wait, there is nog next ...
})

app.listen(9000);  // shorthand for creating ...

