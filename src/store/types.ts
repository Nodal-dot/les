export interface User {
    id: number;
    username: string;
    role: 'user' | 'moderator' | 'admin';
    name: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }
  
  export interface RootState {
    auth: AuthState;
  }