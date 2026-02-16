const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const { findUserByEmail } = require('../users');
const { verifyToken } = require('../auth');

describe('POST /api/auth/login', () => {
  test('正常なログイン認証情報でトークンが返される', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email', 'user@example.com');

    // トークンが有効であることを確認
    const decoded = verifyToken(response.body.token);
    expect(decoded).toBeTruthy();
    expect(decoded.email).toBe('user@example.com');
  });

  test('メールアドレスが存在しない場合は401エラーが返される', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      })
      .expect(401);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Invalid email or password');
  });

  test('パスワードが間違っている場合は401エラーが返される', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'wrongpassword',
      })
      .expect(401);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Invalid email or password');
  });

  test('メールアドレスが未指定の場合は400エラーが返される', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        password: 'password123',
      })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Email and password are required');
  });

  test('パスワードが未指定の場合は400エラーが返される', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
      })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Email and password are required');
  });
});

describe('Token verification', () => {
  test('有効なトークンがデコードされる', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password123',
      });

    const token = loginResponse.body.token;
    const decoded = verifyToken(token);

    expect(decoded).toBeTruthy();
    expect(decoded.userId).toBe(1);
    expect(decoded.email).toBe('user@example.com');
  });

  test('無効なトークンはnullを返す', () => {
    const decoded = verifyToken('invalid-token');
    expect(decoded).toBeNull();
  });
});
