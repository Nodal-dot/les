import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

import { loginStart, loginSuccess, loginFailure, logout } from '../store/authSlice';
import { RootState, User } from '../store/types';

const mockUsers: User[] = [
  { id: 1, username: 'user', role: 'user', name: 'Regular User' },
  { id: 2, username: 'moderator', role: 'moderator', name: 'Moderator' },
  { id: 3, username: 'admin', role: 'admin', name: 'Administrator' },
];

export const useAuth = () => {
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const login = async (username: string, password: string) => {
    dispatch(loginStart());
    
    // Mock authentication
    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.username === username);
      if (foundUser && password === 'password') {
        dispatch(loginSuccess(foundUser));
      } else {
        dispatch(loginFailure('Invalid credentials'));
      }
    }, 500);
  };

  const signOut = () => {
    dispatch(logout());
  };

  return { user, isAuthenticated, loading, error, login, signOut };
};