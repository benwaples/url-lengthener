const express = require('express');
const app = express();
const Url = require('./url');

app.use(express.json());


app.post('/urls', async(req, res, next) => {
  try {
    const makeUrl = await Url.insert(req.body);
    res.send(makeUrl);
    
  } catch(error) {
    next(error);
  }
});

app.get('/urls/:user_url', async(req, res, next) => {
  try {
    const makeUrl = await Url.findByUrl(req.params.user_url);
    res.send(makeUrl);
    
  } catch(error) {
    next(error);
  }
});

app.get('/urls/', async(req, res, next) => {
  try {
    const makeUrl = await Url.findAll();
    res.send(makeUrl);
    
  } catch(error) {
    next(error);
  }
});

app.get('/redirect/:generated_url', async(req, res, next) => {
  try {
    const redirectUrl = await Url.findByGeneratedUrl(req.params.generated_url);

    res.redirect(`http://${redirectUrl.userUrl}`);
  } catch(error) {
    next(error);
  }
});

app.put('/urls/', async(req, res, next) => {
  try {
    console.log(req.body.googleId, req.body.user_url);
    const updateUrl = await Url.update(req.body.googleId, req.body.user_url);
    res.send(updateUrl);
  } catch(error) {
    next(error);
  }
});


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
