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

    describe('User successfully logs in', () => {
      it('should return 200', async () => {
        const response: Response = await request(app).post('/v1/auth/login').send({ email: 'a@a.com', password: 'password123' });
        expect(response.status).to.equal(200);
      });

      it('should return correct info about the user', async () => {
        const response: Response = await request(app).post('/v1/auth/login').send({ email: 'a@a.com', password: 'password123' });
        expect(response.body.user.name).to.equal('James Maxwell');
        expect(response.body.user.email).to.equal('a@a.com');
      });

      it('should return an access token with expiration date', async () => {
        const response: Response = await request(app).post('/v1/auth/login').send({ email: 'a@a.com', password: 'password123' });
        expect(response.body.token.access.token).to.a('string');
        expect(response.body.token.access.expires).to.a('string');
      });
    });

    describe('User does not successfully logs in', () => {
      it('should return 401 if credentials are invalid', async () => {
        const response: Response = await request(app).post('/v1/auth/login').send({ email: 'b@b.com', password: 'password321' });
        expect(response.status).to.equal(401);
      });

      it('should return error message if email is invalid', async () => {
        const response: Response = await request(app).post('/v1/auth/login').send({ email: 'b@b.com', password: 'password123' });
        expect(response.text).to.include('Incorrect e-mail or password');
      });

      it('should return error message if password is invalid', async () => {
        const response: Response = await request(app).post('/v1/auth/login').send({ email: 'a@a.com', password: 'password321' });
        expect(response.text).to.include('Incorrect e-mail or password');
      });
    });
  });

  describe('POST v1/auth/register', () => {
    describe('User successfully creates account', () => {
      beforeEach(async () => {
        await User.deleteMany({});
      });
      it('should return 201', async () => {
        const response: Response = await request(app).post('/v1/auth/register').send({ email: 'a@a.com', name: 'James Maxwell', password: 'password123' });
        expect(response.status).to.equal(201);
      });

      it('should return correct info about the created user', async () => {
        const response: Response = await request(app).post('/v1/auth/register').send({ email: 'a@a.com', name: 'James Maxwell', password: 'password123' });
        expect(response.body.user.name).to.equal('James Maxwell');
        expect(response.body.user.email).to.equal('a@a.com');
      });
    });

    describe('User does not successfully creates account', () => {
      it('should return 400 if email is missing', async () => {
        const response: Response = await request(app).post('/v1/auth/register').send({ name: 'James Maxwell', password: 'password123' });
        expect(response.status).to.equal(400);
      });

      it('should return 400 if password is missing', async () => {
        const response: Response = await request(app).post('/v1/auth/register').send({ email: 'a@a.com', name: 'James Maxwell' });
        expect(response.status).to.equal(400);
      });

      it('should return 400 if name is missing', async () => {
        const response: Response = await request(app).post('/v1/auth/register').send({ email: 'a@a.com', password: 'password123' });
        expect(response.status).to.equal(400);
      });

      it('should return error message saying the name of missing field', async () => {
        const response: Response = await request(app).post('/v1/auth/register').send({ name: 'James Maxwell', password: 'password123' });
        expect(response.text).to.include('&quot;email&quot; is required');
      });
    });
  });
});
