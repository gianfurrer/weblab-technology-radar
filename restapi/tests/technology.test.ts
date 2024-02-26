import createMemoryStore from 'memorystore';
jest.doMock('connect-pg-simple', () => ({
  __esModule: true,
  default: createMemoryStore,
}));

import request from 'supertest';
import { app, server } from '../src/index';
import { Category, PublishDetails, Ring, Technology } from '../src/types/technology.types';

jest.mock('@src/database/database');

describe('Technology API', () => {
  afterAll(() => {
    server.close();
  });

  describe('as user', () => {
    const credentials = { email: 'user@technology-radar.ch', password: 'user-password' };
    let cookie: string[];

    beforeAll(async () => {
      const res = await request(app).post('/api/v1/auth/login').send(credentials);
      cookie = [...res.header['set-cookie']];
      expect(cookie).toBeDefined();
    });

    it('should be able to fetch published technologies', async () => {
      // No Cookie set: expect Unauthorized
      {
        const res = await request(app).get('/api/v1/technologies');
        expect(res.statusCode).toBe(403);
      }

      // Send User Cookie and onlyPublished=true: expect success
      {
        const res = await request(app).get('/api/v1/technologies?onlyPublished=true').set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        const technologies = res.body;
        expect(technologies.length).toBeGreaterThan(0);

        // Assert that only published technologies are returned
        expect(technologies.length).toEqual(technologies.filter((t) => t.published).length);
      }

      // Send User Cookie and onlyPublished=false: ignore onlyPublished and only send published
      {
        const res = await request(app).get('/api/v1/technologies?onlyPublished=false').set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        const technologies = res.body;
        expect(technologies.length).toBeGreaterThan(0);

        // Assert that only published technologies are returned (because User does not have priviledge for unpublished)
        expect(technologies.length).toEqual(technologies.filter((t) => t.published).length);
      }
    });

    it('should not be able to create/edit/publish technologies', async () => {
      const technology: Technology = {
        name: 'MyTechnology',
        category: Category.Platforms,
        description: 'testing',
      };

      // Create Technology
      {
        const res = await request(app).post('/api/v1/technologies').set('Cookie', cookie).send(technology);
        expect(res.statusCode).toBe(403);
      }

      // Edit Technology
      {
        const editTechnology = { ...technology, id: '1' };
        const res = await request(app).put('/api/v1/technologies').set('Cookie', cookie).send(editTechnology);
        expect(res.statusCode).toBe(403);
      }

      // Publish Technology
      {
        const publishDetails: PublishDetails = { id: '1', publish: true, ring: Ring.Adopt, ring_reason: 'testing' };
        const res = await request(app).post('/api/v1/technologies/publish').set('Cookie', cookie).send(publishDetails);
        expect(res.statusCode).toBe(403);
      }
    });
  });

  describe('as CTO', () => {
    const credentials = { email: 'cto@technology-radar.ch', password: 'cto-password' };
    let cookie: string[];

    beforeAll(async () => {
      const res = await request(app).post('/api/v1/auth/login').send(credentials);
      cookie = [...res.header['set-cookie']];
      expect(cookie).toBeDefined();
    });

    it('should be able to fetch all technologies', async () => {
      // Send CTO Cookie and onlyPublished=true: expect only published
      {
        const res = await request(app).get('/api/v1/technologies?onlyPublished=true').set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        const technologies = res.body;
        expect(technologies.length).toBeGreaterThan(0);

        // Assert that only published technologies are returned
        expect(technologies.length).toEqual(technologies.filter((t) => t.published).length);
      }

      // Send CTO Cookie and onlyPublished=false: expect all technologies
      {
        const res = await request(app).get('/api/v1/technologies?onlyPublished=false').set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        const technologies: Technology[] = res.body;
        expect(technologies.length).toBeGreaterThan(0);

        // Assert that only also unpublished technologies are returned
        expect(technologies.length).toBeGreaterThan(technologies.filter((t) => t.published).length);
      }
    });

    it('should be able to create/edit/publish technologies', async () => {
      let technology: Technology = {
        name: 'MyTechnology',
        category: Category.Platforms,
        description: 'testing',
        ring: Ring.Adopt,
        published: false,
      };

      // Create Technology
      {
        expect(technology.created_by).toBeFalsy();

        const res = await request(app).post('/api/v1/technologies').set('Cookie', cookie).send(technology);
        console.log(res.error);
        expect(res.statusCode).toBe(200);
        technology = res.body;
        expect(technology.id).toBeDefined();
        expect(technology.created_by).toEqual(credentials.email);
      }

      // Edit Technology
      {
        expect(technology.changed_by).toBeFalsy();

        technology.category = Category.Techniques;
        const res = await request(app).put('/api/v1/technologies').set('Cookie', cookie).send(technology);
        expect(res.statusCode).toBe(200);
        technology = res.body;
        expect(technology.changed_by).toEqual(credentials.email);
      }

      // Publish Technology
      {
        expect(technology.published).toBe(false);
        expect(technology.published_at).toBeFalsy();

        const publishDetails: PublishDetails = {
          id: technology.id as string,
          publish: true,
          ring: technology.ring as Ring,
          ring_reason: 'testing',
        };
        const res = await request(app).post('/api/v1/technologies/publish').set('Cookie', cookie).send(publishDetails);
        expect(res.statusCode).toBe(200);
        technology = res.body;

        expect(technology.published).toBe(true);
        expect(technology.published_at).toBeTruthy();
      }
    });
  });
});
