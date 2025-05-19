import users from './users.json';
import { User } from '../store/types';

interface LoginResponse {
  user: Omit<User, 'password'>;
}

export const mockAxios = {
  post: async <T extends LoginResponse>(url: string, data?: any): Promise<{ data: T }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (url === '/api/login') {
      const { username, password } = data;
      const user = users.find(
        u => u.username === username && u.password === password
      );

      if (user) {
        const { password: _, ...userData } = user;
        return { data: { user: userData } as T };
      } else {
        throw new Error('Invalid credentials');
      }
    }

    throw new Error('Unknown endpoint');
  }
};