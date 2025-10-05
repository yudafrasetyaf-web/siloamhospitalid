import request from 'supertest';
import app from '../index';
import { testSequelize, testUtils } from './setup';
import User from '../models/User';
import bcrypt from 'bcrypt';

describe('Authentication', () => {
  beforeEach(async () => {
    await testUtils.clearDatabase();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = testUtils.generateTestUser();

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.password).toBeUndefined();
      expect(response.body.data.token).toBeDefined();

      // Verify user was created in database
      const user = await User.findOne({ where: { email: userData.email } });
      expect(user).toBeTruthy();
      expect(user?.email).toBe(userData.email);
      expect(user?.role).toBe(userData.role);
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        ...testUtils.generateTestUser(),
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('email');
    });

    it('should not register user with weak password', async () => {
      const userData = {
        ...testUtils.generateTestUser(),
        password: '123'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('password');
    });

    it('should not register duplicate email', async () => {
      const userData = testUtils.generateTestUser();
      
      // Create first user
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('already exists');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    let userData: any;

    beforeEach(async () => {
      userData = testUtils.generateTestUser();
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: userData.password
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid credentials');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid credentials');
    });

    it('should not login inactive user', async () => {
      // Deactivate user
      const user = await User.findOne({ where: { email: userData.email } });
      if (user) {
        user.isActive = false;
        await user.save();
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid credentials');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      const userData = testUtils.generateTestUser();
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);
      token = response.body.data.token;
    });

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should not get current user without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('No token provided');
    });

    it('should not get current user with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid token');
    });
  });

  describe('Password Security', () => {
    it('should hash password before storing', async () => {
      const userData = testUtils.generateTestUser();
      
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      const user = await User.findOne({ where: { email: userData.email } });
      expect(user?.password).not.toBe(userData.password);
      expect(user?.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
    });

    it('should verify password correctly', async () => {
      const userData = testUtils.generateTestUser();
      
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      const user = await User.findOne({ where: { email: userData.email } });
      const isValid = await bcrypt.compare(userData.password, user?.password || '');
      expect(isValid).toBe(true);
    });
  });
});
