import { User } from './types';

// In-memory user store (実際のDBの代わり)
export class UserStore {
  private users: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    return user || null;
  }

  async create(user: User): Promise<User> {
    if (await this.findByEmail(user.email)) {
      throw new Error('User with this email already exists');
    }
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  // テスト用
  clear(): void {
    this.users.clear();
  }
}

export const userStore = new UserStore();
