import request from 'supertest';
import { createApp } from './app';
import { userStore } from './userStore';

const app = createApp();

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    userStore.clear();
  });

  it('should create a new user with valid data', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'Password123'
      })
      .expect(201);

    expect(response.body).toMatchObject({
      email: 'test@example.com'
    });
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.passwordHash).toBeUndefined();
  });

  it('should return 400 for missing email', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        password: 'Password123'
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  it('should return 400 for missing password', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com'
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'invalid-email',
        password: 'Password123'
      })
      .expect(400);

    expect(response.body.error).toContain('Invalid email format');
  });

  it('should return 400 for weak password', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'weak'
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  it('should return 400 for duplicate email', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123'
    };

    await request(app)
      .post('/api/auth/signup')
      .send(userData)
      .expect(201);

    const response = await request(app)
      .post('/api/auth/signup')
      .send(userData)
      .expect(400);

    expect(response.body.error).toContain('already exists');
  });

  it('should not expose password in response', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'Password123'
      })
      .expect(201);

    expect(response.body.password).toBeUndefined();
    expect(response.body.passwordHash).toBeUndefined();
  });
});
