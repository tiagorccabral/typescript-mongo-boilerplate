import request, { Response } from 'supertest';
import httpStatus from 'http-status';
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
          expect(response.status).to.equal(httpStatus.OK);
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
        it('should return 200', async () => {
          const response: Response = await request(app).get(`/v1/users/${secondUser.id}`).set('authorization', authString);
          expect(response.status).to.equal(httpStatus.OK);
        });
        it('should return different user data', async () => {
          const response: Response = await request(app).get(`/v1/users/${secondUser.id}`).set('authorization', authString);
          expect(response.body.user.name).to.equal(secondUser.name);
          expect(response.body.user.email).to.equal(secondUser.email);
        });
      });
      describe('retrieves not valid user ID', () => {
        before(async () => {
          await User.deleteMany({});
          user = await User.create({ email: 'a@a.com', name: 'James Maxwell', password: 'password123' });
          const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(user);
          authString = `Bearer ${token.access.token}`;
        });
        after(async () => {
          await User.deleteMany({});
        });
        it('should return 400', async () => {
          const response: Response = await request(app).get('/v1/users/nonexistent').set('authorization', authString);
          expect(response.status).to.equal(400);
        });
        it('should return message saying User ID is not valid', async () => {
          const response: Response = await request(app).get('/v1/users/nonexistent').set('authorization', authString);
          expect(response.text).to.include('User ID is not valid');
        });
      });
    });
  });

  describe('POST v1/users/create-admin', () => {
    describe('Current user is logged as an admin user', () => {
      let user: IUserDoc;
      let authString: string;
      describe('creates an admin user', () => {
        beforeEach(async () => {
          await User.deleteMany({});
          user = await User.create({
            email: 'admin1@email.com', name: 'Admin User', password: 'password123', role: 'admin'
          });
          const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(user);
          authString = `Bearer ${token.access.token}`;
        });
        afterEach(async () => {
          await User.deleteMany({});
        });
        it('should return 201', async () => {
          const response: Response = await request(app).post('/v1/users/create-admin')
            .set('authorization', authString)
            .send({ email: 'admin2@email.com', name: 'James Maxwell', password: 'password123' });
          expect(response.status).to.equal(201);
        });
        it('should return new admin user', async () => {
          const response: Response = await request(app).post('/v1/users/create-admin')
            .set('authorization', authString)
            .send({ email: 'admin2@email.com', name: 'James Maxwell', password: 'password123' });
          expect(response.body.user.name).to.equal('James Maxwell');
          expect(response.body.user.email).to.equal('admin2@email.com');
          expect(response.body.user.role).to.equal('admin');
        });
      });
      describe('does not create new admin user', () => {
        before(async () => {
          await User.deleteMany({});
          user = await User.create({
            email: 'admin1@email.com', name: 'Admin User', password: 'password123', role: 'admin'
          });
          const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(user);
          authString = `Bearer ${token.access.token}`;
        });
        after(async () => {
          await User.deleteMany({});
        });
        it('should return 400 if missing fields', async () => {
          const response: Response = await request(app).post('/v1/users/create-admin')
            .set('authorization', authString)
            .send({ email: 'admin2@email.com', password: 'password123' });
          expect(response.status).to.equal(400);
        });
        it('should return error message if e-mail already exists', async () => {
          const response: Response = await request(app).post('/v1/users/create-admin')
            .set('authorization', authString)
            .send({ email: user.email, name: 'New admin', password: 'password123' });
          expect(response.status).to.equal(400);
          expect(response.text).to.include('Email already taken');
        });
      });
    });

    describe('Current user is logged as a regular user', () => {
      let user: IUserDoc;
      let authString: string;
      beforeEach(async () => {
        await User.deleteMany({});
        user = await User.create({
          email: 'regular@email.com', name: 'Regular User', password: 'password123'
        });
        const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(user);
        authString = `Bearer ${token.access.token}`;
      });
      afterEach(async () => {
        await User.deleteMany({});
      });
      it('should return 401', async () => {
        const response: Response = await request(app).post('/v1/users/create-admin')
          .set('authorization', authString)
          .send({ email: 'admin1@email.com', name: 'James Maxwell', password: 'password123' });
        expect(response.status).to.equal(401);
      });
    });

    describe('Current user is not logged in', () => {
      beforeEach(async () => {
        await User.deleteMany({});
      });
      afterEach(async () => {
        await User.deleteMany({});
      });
      it('should return 401', async () => {
        const response: Response = await request(app).post('/v1/users/create-admin')
          .send({ email: 'admin1@email.com', name: 'James Maxwell', password: 'password123' });
        expect(response.status).to.equal(401);
      });
    });
  });

  describe('POST v1/users/', () => {
    describe('User is not logged in', () => {
      describe('creates a new user', () => {
        beforeEach(async () => {
          await User.deleteMany({});
        });
        afterEach(async () => {
          await User.deleteMany({});
        });
        it('should return 201', async () => {
          const response: Response = await request(app).post('/v1/users/')
            .send({ email: 'user@createduser.com', name: 'User Name', password: 'password123' });

          expect(response.status).to.equal(201);
        });
        it('should return data of created user', async () => {
          const response: Response = await request(app).post('/v1/users/')
            .send({ email: 'user@createduser.com', name: 'User Name', password: 'password123' });

          expect(response.body.user.name).to.equal('User Name');
          expect(response.body.user.email).to.equal('user@createduser.com');
        });
      });
      describe('can not create user if e-mail already exists', () => {
        beforeEach(async () => {
          await User.deleteMany({});
        });
        afterEach(async () => {
          await User.deleteMany({});
        });
        it('should return 400', async () => {
          await request(app).post('/v1/users/')
            .send({ email: 'user@createduser.com', name: 'First Name', password: 'password123' });
          const response: Response = await request(app).post('/v1/users/')
            .send({ email: 'user@createduser.com', name: 'Other Name', password: 'password321' });

          expect(response.status).to.equal(400);
        });
        it('should return error message', async () => {
          await request(app).post('/v1/users/')
            .send({ email: 'user@createduser.com', name: 'First Name', password: 'password123' });
          const response: Response = await request(app).post('/v1/users/')
            .send({ email: 'user@createduser.com', name: 'Other Name', password: 'password321' });

          expect(response.text).to.include('Email already taken');
        });
      });
    });
  });

  describe('PATCH v1/users/:id', () => {
    describe('Current user is logged in', () => {
      let user: IUserDoc;
      let authString: string;
      describe('updates own user data', () => {
        beforeEach(async () => {
          await User.deleteMany({});
          user = await User.create({
            email: 'user1@email.com', name: 'User', password: 'password123'
          });
          const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(user);
          authString = `Bearer ${token.access.token}`;
        });
        afterEach(async () => {
          await User.deleteMany({});
        });
        it('should return 200', async () => {
          const response: Response = await request(app).patch(`/v1/users/${user.id}`)
            .set('authorization', authString)
            .send({ email: 'user1@emailupdated.com', name: 'User Name' });
          expect(response.status).to.equal(200);
        });
        it('should return user data updated', async () => {
          const response: Response = await request(app).patch(`/v1/users/${user.id}`)
            .set('authorization', authString)
            .send({ email: 'user1@emailupdated.com', name: 'User Name' });

          expect(response.body.user.name).to.equal('User Name');
          expect(response.body.user.email).to.equal('user1@emailupdated.com');
        });
      });
      describe('can not update to existing e-mail', () => {
        beforeEach(async () => {
          await User.deleteMany({});
          user = await User.create({
            email: 'user1@email.com', name: 'User', password: 'password123'
          });
          await User.create({
            email: 'existing@email.com', name: 'User', password: 'password123'
          });
          const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(user);
          authString = `Bearer ${token.access.token}`;
        });
        afterEach(async () => {
          await User.deleteMany({});
        });
        it('should return 400', async () => {
          const response: Response = await request(app).patch(`/v1/users/${user.id}`)
            .set('authorization', authString)
            .send({ email: 'existing@email.com', name: 'User Name' });
          expect(response.status).to.equal(400);
        });
        it('should return error message', async () => {
          const response: Response = await request(app).patch(`/v1/users/${user.id}`)
            .set('authorization', authString)
            .send({ email: 'existing@email.com', name: 'User Name' });

          expect(response.text).to.include('Email already taken');
        });
      });
    });

    describe('Current user is not same as user to be updated', () => {
      let user: IUserDoc;
      let otherUser: IUserDoc;
      let authString: string;
      beforeEach(async () => {
        await User.deleteMany({});
        user = await User.create({
          email: 'usertoupdate@email.com', name: 'User to Update', password: 'password123'
        });
        otherUser = await User.create({
          email: 'otheruser@email.com', name: 'Other user', password: 'password123'
        });
        const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(otherUser);
        authString = `Bearer ${token.access.token}`;
      });
      afterEach(async () => {
        await User.deleteMany({});
      });

      it('should return 401', async () => {
        const response: Response = await request(app).patch(`/v1/users/${user.id}`)
          .set('authorization', authString)
          .send({ email: 'update@email.com', name: 'Updated Name' });
        expect(response.status).to.equal(401);
      });

      it('should return error message', async () => {
        const response: Response = await request(app).patch(`/v1/users/${user.id}`)
          .set('authorization', authString)
          .send({ email: 'update@email.com', name: 'Updated Name' });
        expect(response.text).to.include('You cannot access this content');
      });
    });

    describe('User is not logged in', () => {
      let user: IUserDoc;
      beforeEach(async () => {
        await User.deleteMany({});
        user = await User.create({
          email: 'usertoupdate@email.com', name: 'User to Update', password: 'password123'
        });
      });
      afterEach(async () => {
        await User.deleteMany({});
      });

      it('should return 401', async () => {
        const response: Response = await request(app).patch(`/v1/users/${user.id}`)
          .send({ email: 'update@email.com', name: 'Updated Name' });
        expect(response.status).to.equal(401);
      });

      it('should return error message', async () => {
        const response: Response = await request(app).patch(`/v1/users/${user.id}`)
          .send({ email: 'update@email.com', name: 'Updated Name' });
        expect(response.text).to.include('Please login');
      });
    });
  });

  describe('DELETE v1/users/:id', () => {
    describe('Current user is logged in', () => {
      let user: IUserDoc;
      let authString: string;
      describe('deletes its user account', () => {
        beforeEach(async () => {
          await User.deleteMany({});
          user = await User.create({
            email: 'user1@email.com', name: 'User', password: 'password123'
          });
          const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(user);
          authString = `Bearer ${token.access.token}`;
        });
        afterEach(async () => {
          await User.deleteMany({});
        });
        it('should return 204', async () => {
          const response: Response = await request(app).delete(`/v1/users/${user.id}`)
            .set('authorization', authString);
          expect(response.status).to.equal(204);
        });
        it('should delete user from database', async () => {
          await request(app).delete(`/v1/users/${user.id}`)
            .set('authorization', authString);

          const deletedUser = await User.findById(user.id);

          expect(deletedUser).to.equal(null);
        });
      });

      describe('attempts to delete nonexistent account', () => {
        beforeEach(async () => {
          await User.deleteMany({});
          user = await User.create({
            email: 'user1@email.com', name: 'User', password: 'password123'
          });
          const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(user);
          authString = `Bearer ${token.access.token}`;
        });
        afterEach(async () => {
          await User.deleteMany({});
        });
        it('should return 422', async () => {
          await request(app).delete(`/v1/users/${user.id}`)
            .set('authorization', authString);
          const response: Response = await request(app).delete(`/v1/users/${user.id}`)
            .set('authorization', authString);
          expect(response.status).to.equal(422);
        });
        it('should return error message', async () => {
          await request(app).delete(`/v1/users/${user.id}`)
            .set('authorization', authString);
          const response: Response = await request(app).delete(`/v1/users/${user.id}`)
            .set('authorization', authString);
          expect(response.text).to.include('Invalid User ID');
        });
      });
    });

    describe('Current user is not same as user to be deleted', () => {
      let user: IUserDoc;
      let otherUser: IUserDoc;
      let authString: string;
      beforeEach(async () => {
        await User.deleteMany({});
        user = await User.create({
          email: 'user1@email.com', name: 'User', password: 'password123'
        });
        otherUser = await User.create({
          email: 'existing@email.com', name: 'User', password: 'password123'
        });
        const token: tokenService.IAccessToken = await tokenService.generateAuthTokens(user);
        authString = `Bearer ${token.access.token}`;
      });
      afterEach(async () => {
        await User.deleteMany({});
      });
      it('should return 401', async () => {
        const response: Response = await request(app).delete(`/v1/users/${otherUser.id}`)
          .set('authorization', authString);
        expect(response.status).to.equal(401);
      });
      it('should return error message', async () => {
        const response: Response = await request(app).delete(`/v1/users/${otherUser.id}`)
          .set('authorization', authString);

        expect(response.text).to.include('You cannot access this content');
      });
    });

    describe('User is not logged in', () => {
      let user: IUserDoc;
      beforeEach(async () => {
        await User.deleteMany({});
        user = await User.create({
          email: 'usertodelete@email.com', name: 'User to Delete', password: 'password123'
        });
      });
      afterEach(async () => {
        await User.deleteMany({});
      });

      it('should return 401', async () => {
        const response: Response = await request(app).delete(`/v1/users/${user.id}`);

        expect(response.status).to.equal(401);
      });

      it('should return error message', async () => {
        const response: Response = await request(app).delete(`/v1/users/${user.id}`);

        expect(response.text).to.include('Please login');
      });
    });
  });
});
