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

    const foundGeneratedUrl = await Url.findByUrl('google.com')

    expect(foundGeneratedUrl).toEqual({
      id: google.id,
      user_url: 'google.com',
      generated_url: expect.any(String)
    })
  })
});
