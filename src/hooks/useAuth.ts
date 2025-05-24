import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { loginUser, logout } from '../store/authSlice';
import { RootState } from '../store/types';

export const useAuth = () => {
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const signIn = async (username: string, password: string) => {
    try {
      await dispatch(loginUser({ username, password })).unwrap();
    } catch (err) {
    }
  };

  const signOut = () => {
    dispatch(logout());
  };

  return { 
    user, 
    isAuthenticated, 
    loading, 
    error, 
    login: signIn, 
    signOut 
  };
};