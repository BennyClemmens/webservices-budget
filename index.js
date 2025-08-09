const Koa = require('koa'); // old import style
const app = new Koa();

app.use(async (context, next) => {
  console.log('logging the context, just after the start of the first middleware');
  console.log(context);
  console.log('just before the await next in the first middleware');
  await next();
  console.log('just behind the await next in the first middleware');
});

app.use(async (context, next) => {
  console.log('logging the context, just after the start of the second middleware');
  console.log(context);
  console.log('changing the body of the context');
  context.body = 'Hello World';
  console.log('logging the context, just after changing it');
  console.log(context);
  console.log('just before the await next in the second middleware');
  await next();
  console.log('just behind the await next in the second middleware');
});

app.use(async (context, next) => {
  console.log('logging the context, just after the start of the third middleware');
  console.log(context);
  console.log('just before the await next in the third middleware');
  return next();
});

app.listen(9000);  // shorthand for creating ...
