import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User, SignupRequest, SignupResponse } from './types';
import { validateSignupRequest } from './validation';
import { userStore } from './userStore';

const SALT_ROUNDS = 10;

export class AuthService {
  async signup(request: SignupRequest): Promise<SignupResponse> {
    const { email, password } = request;

    // Validation
    const validation = validateSignupRequest(email, password);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await userStore.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user: User = {
      id: randomUUID(),
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date()
    };

    await userStore.create(user);

    // Return response without password
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    };
  }
}

export const authService = new AuthService();
