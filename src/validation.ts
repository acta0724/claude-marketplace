import validator from 'validator';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSignupRequest(email: string, password: string): ValidationResult {
  const errors: string[] = [];

  // Email validation
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else if (!validator.isEmail(email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
