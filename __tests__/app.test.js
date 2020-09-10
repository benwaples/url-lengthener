const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Url = require('../lib/url');

describe('short-url routes', () => {
  beforeEach(() => {

    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));

  });
  it('should create a new url via post', async() => {
    const response = await request(app)
      .post('/api/urls')
      .send({
        userUrl: 'google.com'
      });
    expect(response.body).toEqual({ id: expect.any(String), user_url: 'google.com', generated_url: expect.any(String) });
  });

  it('should get a url by userUrl', async() => {
    const makeUrl = await request(app)
  
      .post('/api/urls')
      .send({
        userUrl: 'google.com'
      });
    const response = await request(app)
      .get(`/api/urls/${makeUrl.body.user_url}`);
    expect(response.body).toEqual({ id: expect.any(String), user_url: 'google.com', generated_url: expect.any(String) });
  });

  it('get all urls', async() => {
    await Promise.all([
      await Url.insert({ userUrl: 'google.com' }),
      await Url.insert({ userUrl: 'yahoo.com' }),
      await Url.insert({ userUrl: 'msn.com' })
    ]);

    const response = await request(app)
      .get('/api/urls');
    expect(response.body).toEqual(expect.arrayContaining([
      { id: expect.any(String), user_url: 'google.com', generated_url: expect.any(String) },
      { id: expect.any(String), user_url: 'yahoo.com', generated_url: expect.any(String) },
      { id: expect.any(String), user_url: 'msn.com', generated_url: expect.any(String) }
    ]));
  });

  it('should redirect the user to a the users url', async() => {
    const google = await Url.insert({ userUrl: 'google.com' });

    const response = await request(app)
      .get(`/api/urls/${google.generated_url}`);

    console.log(response);
    expect(response.body).toEqual('google.com');
  });
});
