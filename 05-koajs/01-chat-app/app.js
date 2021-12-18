const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  await new Promise((resolve) => {
    const messageResolver = (message) => {
      ctx.body = message;
      resolve(messageResolver);
    };

    app.on('message', messageResolver);
  }).then((mResolver) => {
    app.off('message', mResolver);
  });
  next();
});

router.post('/publish', async (ctx, next) => {
  if (!ctx.request.body.message) {
    ctx.body = null;
    next();
  } else {
    next();
    ctx.app.emit('message', ctx.request.body.message);
    ctx.body = 'sent';
  }
});

app.use(router.routes());

module.exports = app;
