import { validateSignupRequest } from './validation';

describe('validateSignupRequest', () => {
  describe('email validation', () => {
    it('should reject empty email', () => {
      const result = validateSignupRequest('', 'Password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });

    it('should reject invalid email format', () => {
      const result = validateSignupRequest('invalid-email', 'Password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    it('should accept valid email', () => {
      const result = validateSignupRequest('test@example.com', 'Password123');
      expect(result.valid).toBe(true);
    });
  });

  describe('password validation', () => {
    it('should reject empty password', () => {
      const result = validateSignupRequest('test@example.com', '');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });

    it('should reject password shorter than 8 characters', () => {
      const result = validateSignupRequest('test@example.com', 'Pass1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase letter', () => {
      const result = validateSignupRequest('test@example.com', 'password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase letter', () => {
      const result = validateSignupRequest('test@example.com', 'PASSWORD123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const result = validateSignupRequest('test@example.com', 'Password');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should accept strong password', () => {
      const result = validateSignupRequest('test@example.com', 'Password123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
