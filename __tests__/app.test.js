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
      .post('/urls')
      .send({
        userUrl: 'google.com'
      });
    expect(response.body).toEqual({ id: expect.any(String), user_url: 'google.com', generated_url: expect.any(String) });
  });

  it('should get a url by userUrl', async() => {
    const makeUrl = await request(app)
  
      .post('/urls')
      .send({
        userUrl: 'google.com'
      });
    const response = await request(app)
      .get(`/urls/${makeUrl.body.user_url}`);
    expect(response.body).toEqual({ id: expect.any(String), user_url: 'google.com', generated_url: expect.any(String) });
  });

  it('get all urls', async() => {
    await Promise.all([
      await Url.insert({ userUrl: 'google.com' }),
      await Url.insert({ userUrl: 'yahoo.com' }),
      await Url.insert({ userUrl: 'msn.com' })
    ]);

    const response = await request(app)
      .get('/urls');
    expect(response.body).toEqual(expect.arrayContaining([
      { id: expect.any(String), user_url: 'google.com', generated_url: expect.any(String) },
      { id: expect.any(String), user_url: 'yahoo.com', generated_url: expect.any(String) },
      { id: expect.any(String), user_url: 'msn.com', generated_url: expect.any(String) }
    ]));
  });
 
  it('should convert the users url to json to be passed to the redirect endpoint', async() => {
    const google = await Url.insert({ userUrl: 'google.com' });

    expect(google.user_url).toEqual('google.com');
  });

  it('should change userUrl by id', async() => {
    const google = await Url.insert({ userUrl: 'google.com' });
    const updateUrl = await request(app)
      .put('/urls/')
      .send({
        googleId: google.id,
        user_url: { userUrl:'yahoo.com' }
      });

    expect(updateUrl.body).toEqual({ id: expect.any(String), userUrl: 'yahoo.com', generatedUrl: expect.any(String) });

  });

  it.only('should delete a url by userUrl', async() => {
    const google = await Url.insert({ userUrl: 'google.com' });
    const deleteUrl = await request(app)
      .delete(`/urls/${google.id}`);
    
    expect(deleteUrl.body).toEqual({ id: google.id, userUrl: 'google.com', generatedUrl: expect.any(String) });
  });
});
