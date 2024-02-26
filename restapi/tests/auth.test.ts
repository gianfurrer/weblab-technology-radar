import createMemoryStore from 'memorystore';
jest.doMock('connect-pg-simple', () => ({
  __esModule: true,
  default: createMemoryStore,
}));

import request from 'supertest';
import { app, server } from '../src/index';

jest.mock('@src/database/database');

describe('Authentication API', () => {
  afterEach(() => {
    server.close();
  });

  describe('on successful login', () => {
    const credentials = { email: 'user@technology-radar.ch', password: 'user-password' };
    let cookie: string[];

    beforeAll(async () => {
      const res = await request(app).post('/api/v1/auth/login').send(credentials);
      cookie = [...res.header['set-cookie']];
      expect(cookie).toBeDefined();
    });

    it('should invalidate cookie after logging out', async () => {
      const logout = async () => await request(app).post('/api/v1/auth/logout').set('Cookie', cookie);

      {
        const res = await logout();
        expect(res.statusCode).toBe(200);
      }

      // Make sure the cookie is invalidated by trying to logout again
      {
        const res = await logout();
        expect(res.statusCode).toBe(403);
      }
    });
  });

  describe('on failed login', () => {
    it('should return the same error message for incorrect email and password', async () => {
      const login = async (credentials) => await request(app).post('/api/v1/auth/login').send(credentials);
      const expectedError = 'Unable to login: email or password is invalid.';
      {
        const incorrectPassword = { email: 'user@technology-radar.ch', password: 'invalid123' };
        const res = await login(incorrectPassword);
        expect(res.statusCode).toBe(401);
        expect(res.error.text).toEqual(expectedError);
      }
      {
        const incorrectEmail = { email: 'invalid@email.ch', password: 'doesntmatter' };
        const res = await login(incorrectEmail);
        expect(res.statusCode).toBe(401);
        expect(res.error.text).toEqual(expectedError);
      }
    });

    it('should check that both email and password are valid', async () => {
      const login = async (credentials) => await request(app).post('/api/v1/auth/login').send(credentials);

      {
        const missingPassword = { email: 'user@technology-radar.ch' };
        const res = await login(missingPassword);
        expect(res.statusCode).toBe(422);
        const errors = JSON.parse(res.error.text).errors;
        expect(errors[0].msg).toEqual("Parameter 'password' not provided");
      }

      {
        const missingEmail = { password: 'doesntmatter' };
        const res = await login(missingEmail);
        expect(res.statusCode).toBe(422);
        const errors = JSON.parse(res.error.text).errors;
        expect(errors[0].msg).toEqual("Parameter 'email' not provided");
      }

      {
        const shortPassword = { email: 'valid@email.com', password: 'short' };
        const res = await login(shortPassword);
        expect(res.statusCode).toBe(422);
        const errors = JSON.parse(res.error.text).errors;
        expect(errors[0].msg).toEqual('Password must be at least 8 characters long');
      }

      {
        const invalidEmail = { email: 'invalidemail', password: 'doesntmatter' };
        const res = await login(invalidEmail);
        expect(res.statusCode).toBe(422);
        const errors = JSON.parse(res.error.text).errors;
        expect(errors[0].msg).toEqual('Invalid email address provided');
      }
    });
  });
});
