import request, { Response } from 'supertest';
import { expect } from 'chai';
import * as tokenService from '../../../../src/modules/auth/services/token.service';
import app from '../../../../src/app';
import User from '../../../../src/modules/users/models/user';
import { IUserDoc } from '../../../../src/modules/users/models/Iuser.interface';

describe('Users routes', () => {
  after(async () => {
    await User.deleteMany({});
  });

  describe('GET v1/users/:id', () => {
    describe('User is logged in', () => {
      let user: IUserDoc;
      let secondUser: IUserDoc;
      let authString: string;
      describe('retrieves own data', () => {
        before(async () => {
          await User.deleteMany({});
          user = await User.create({ email: 'a@a.com', name: 'James Maxwell', password: 'password123' });
          const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(user);
          authString = `Bearer ${token.access.token}`;
        });
        after(async () => {
          await User.deleteMany({});
        });
        it('should return 200', async () => {
          const response: Response = await request(app).get(`/v1/users/${user.id}`).set('authorization', authString);
          expect(response.status).to.equal(200);
        });
        it('should return own user data', async () => {
          const response: Response = await request(app).get(`/v1/users/${user.id}`).set('authorization', authString);
          expect(response.body.user.name).to.equal(user.name);
          expect(response.body.user.email).to.equal(user.email);
        });
      });
      describe('retrieves different user data', () => {
        before(async () => {
          await User.deleteMany({});
          user = await User.create({ email: 'a@a.com', name: 'James Maxwell', password: 'password123' });
          secondUser = await User.create({ email: 'b@b.com', name: 'Arthur Clarcke', password: 'password321' });
          const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(user);
          authString = `Bearer ${token.access.token}`;
        });
        after(async () => {
          await User.deleteMany({});
        });
        it('should return 401', async () => {
          const response: Response = await request(app).get(`/v1/users/${secondUser.id}`).set('authorization', authString);
          expect(response.status).to.equal(401);
        });
        it('should return error message', async () => {
          const response: Response = await request(app).get(`/v1/users/${secondUser.id}`).set('authorization', authString);
          expect(response.text).to.include('You cannot access this content');
        });
      });
    });
  });
});
