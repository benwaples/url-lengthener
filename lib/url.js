const pool = require('./utils/pool');
const generateUrl = require('./utils/generateUrl');

class Url {
  id;
  userUrl;
  generatedUrl;

  constructor(url) {
    this.id = url.id;
    this.userUrl = url.user_url;
    this.generatedUrl = url.generated_url;

  }

  static async insert(url) {
    const generatedUrl = generateUrl();
    const { rows } = await pool.query(
      'INSERT INTO urls (user_url, generated_url) VALUES ($1, $2) RETURNING *',
      [url.userUrl, generatedUrl]

    );
    return rows[0];
  }


}

module.exports = Url;