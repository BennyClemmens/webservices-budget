import Koa from 'koa';
import { getLogger } from './core/logging';
import bodyParser from 'koa-bodyparser';
import installRest from './rest/parent.rest';

const app = new Koa();

app.use(bodyParser());

installRest(app);
// je zou hier nog andere interfaces voor andere clients kunnen bij installeren die dezelfde servicelaag aanspreken

app.listen(9000, () => {
  getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
});
