# Express Errors

### Установка
```bash
npm i git+https://git@github.com/rochnyak-d-i/node-rdi-express-errors.git
```

### Работа
```js
const app = express();

const fallback = (req, res) => res.status(406).send('not ok');
const devMode = process.env.NODE_ENV === 'development';
const {notfound, allErrors, responsePatch} =
  require('rdi-express-errors')(/* {{default: fallback}, devMode} */);

responsePatch(app);

app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return res.throw(405);
  }

  next();
});

app.use((req, res, next) => {
  if (req.path !== '/') {
    return next();
  }

  res.status(200).send('ok');
});

app.use(notfound);
app.use(allErrors);
```
