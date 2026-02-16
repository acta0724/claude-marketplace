import { authService } from './authService';
import { userStore } from './userStore';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
  beforeEach(() => {
    userStore.clear();
  });

  describe('signup', () => {
    it('should create a new user with hashed password', async () => {
      const request = {
        email: 'test@example.com',
        password: 'Password123'
      };

      const result = await authService.signup(request);

      expect(result).toMatchObject({
        email: 'test@example.com'
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);

      // Verify password is hashed
      const user = await userStore.findById(result.id);
      expect(user).toBeDefined();
      expect(user!.passwordHash).not.toBe('Password123');
      
      // Verify hash is valid
      const isValid = await bcrypt.compare('Password123', user!.passwordHash);
      expect(isValid).toBe(true);
    });

    it('should normalize email to lowercase', async () => {
      const request = {
        email: 'Test@Example.COM',
        password: 'Password123'
      };

      const result = await authService.signup(request);
      expect(result.email).toBe('test@example.com');
    });

    it('should reject invalid email', async () => {
      const request = {
        email: 'invalid-email',
        password: 'Password123'
      };

      await expect(authService.signup(request)).rejects.toThrow('Invalid email format');
    });

    it('should reject weak password', async () => {
      const request = {
        email: 'test@example.com',
        password: 'weak'
      };

      await expect(authService.signup(request)).rejects.toThrow();
    });

    it('should reject duplicate email', async () => {
      const request = {
        email: 'test@example.com',
        password: 'Password123'
      };

      await authService.signup(request);
      
      await expect(authService.signup(request)).rejects.toThrow('already exists');
    });
  });
});
