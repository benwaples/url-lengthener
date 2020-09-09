const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');

describe('short-url routes', () => {
  beforeEach(() => {

    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));

  });
  it('should stuff', () => {
    expect(true).toEqual(true);
  });
});
