const fs = require('fs');
const Url = require('./url');
const pool = require('./utils/pool');

describe('Url class', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  it('should add a url to the database', async() => {
    const google = await Url.insert({ userUrl: 'google.com' });
    const { rows } = await pool.query('SELECT * FROM urls WHERE id =$1', [google.id]);
    expect(rows[0]).toEqual({ id: google.id, user_url: 'google.com', generated_url: expect.any(String) });
  });

  it('should get a generated url by user url', async() => {
    const google = await Url.insert({ userUrl: 'google.com' });

    const foundGeneratedUrl = await Url.findByUrl('google.com');

    expect(foundGeneratedUrl).toEqual({
      id: google.id,
      user_url: 'google.com',
      generated_url: expect.any(String)
    });
  });

  it('should get all shortened urls stored in the database', async() => {
    await Promise.all([
      await Url.insert({ userUrl: 'craigslist.com' }),
      await Url.insert({ userUrl: 'facebook.com' }),
      await Url.insert({ userUrl: 'amazon.com' })
    ]);
    const foundAllUrls = await Url.findAll();

    expect(foundAllUrls).toEqual(expect.arrayContaining([
      { id: expect.any(String), user_url: 'craigslist.com', generated_url: expect.any(String) },
      { id: expect.any(String), user_url: 'facebook.com', generated_url: expect.any(String) },
      { id: expect.any(String), user_url: 'amazon.com', generated_url: expect.any(String) },
    ]));
  });

  it('should return the users url from the generated url', async() => {
    const google = await Url.insert({ userUrl: 'google.com' });

    const redirectToUrl = await Url.findByGeneratedUrl(google.generated_url);

    expect(redirectToUrl).toEqual({ id: expect.any(String), userUrl: 'google.com', generatedUrl: expect.any(String) });

  });

  it('should update a user url', async() => {
    const google = await Url.insert({ userUrl: 'google.com' });

    const updatedUrl = await Url.update(google.id, { userUrl: 'yahoo.com' });

    expect(updatedUrl).toEqual({ id: expect.any(String), userUrl: 'yahoo.com', generatedUrl: expect.any(String) });
  });

  it('should delete a url by the id', async() => {
    const google = await Url.insert({ userUrl: 'google.com' });

    const deletedUrl = await Url.delete(google.id);

    expect(deletedUrl).toEqual({ id: expect.any(String), userUrl: 'google.com', generatedUrl: expect.any(String) });
  });
 
});
