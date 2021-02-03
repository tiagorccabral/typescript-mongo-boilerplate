import request, { Response } from 'supertest';
import { expect } from 'chai';
import app from '../../../../src/app';
import User from '../../../../src/modules/users/models/user';

describe('Auth routes', () => {
  after(async () => {
    await User.deleteMany({});
  });

  describe('POST v1/auth/login', () => {
    beforeEach(async () => {
      await User.deleteMany({});
      await User.create({ email: 'a@a.com', name: 'James Maxwell', password: 'password123' });
    });

    it('should return 200', async () => {
      const response: Response = await request(app).post('/v1/auth/login').send({ email: 'a@a.com', password: 'password123' });
      expect(response.status).to.equal(200);
    });

    it('should return correct info about the user', async () => {
      const response: Response = await request(app).post('/v1/auth/login').send({ email: 'a@a.com', password: 'password123' });
      expect(response.body.user.name).to.equal('James Maxwell');
      expect(response.body.user.email).to.equal('a@a.com');
    });

    it('should return 401 if credentials are invalid', async () => {
      const response: Response = await request(app).post('/v1/auth/login').send({ email: 'b@b.com', password: 'password321' });
      expect(response.status).to.equal(401);
    });

    it('should return error message if credentials are invalid', async () => {
      const response: Response = await request(app).post('/v1/auth/login').send({ email: 'b@b.com', password: 'password321' });
      expect(response.text).to.include('Incorrect e-mail or password');
    });
  });
});
