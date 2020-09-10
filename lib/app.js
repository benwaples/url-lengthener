const express = require('express');
const app = express();
const Url = require('./url');

app.use(express.json());


app.post('/api/urls', async(req, res, next) => {
  try {
    const makeUrl = await Url.insert(req.body);
    res.send(makeUrl);
    
  } catch(error) {
    next(error);
  }
});

app.get('/api/urls/:user_url', async(req, res, next) => {
  try {
    const makeUrl = await Url.findByUrl(req.params.user_url);
    res.send(makeUrl);
    
  } catch(error) {
    next(error);
  }
});

app.get('/api/urls/', async(req, res, next) => {
  try {
    const makeUrl = await Url.findAll();
    res.send(makeUrl);
    
  } catch(error) {
    next(error);
  }
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
