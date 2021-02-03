import request, { Response } from 'supertest';
import { expect } from 'chai';
import app from '../../../../src/app';
import config from '../../../../src/config/config';

describe('Health-check routes', () => {
  describe('GET v1/health/', () => {
    let response: Response;
    before(async () => {
      response = await request(app).get('/v1/health/');
    });

    it('should return 200', async () => {
      expect(response.status).to.equal(200);
    });

    it('should return correct info about the system', async () => {
      expect(response.body.message).to.equal('System up and running');
      expect(response.body.name).to.equal(config.system.name);
    });
  });
});
