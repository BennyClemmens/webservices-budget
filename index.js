const Koa = require('koa'); // old import style
const app = new Koa();

app.use(async (context) => {
  context.body = 'Hello World';
});

app.listen(9000);  // shorthand for creating ...

