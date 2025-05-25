import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { loginUser, registerUser, logout, clearError } from '../store/authSlice';
import { RootState } from '../store/types';

export const useAuth = () => {
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const signIn = async (username: string, password: string) => {
    try {
      await dispatch(loginUser({ username, password })).unwrap();
    } catch (err) {

      throw err; 
    }
  };

  const signUp = async (username: string, password: string) => {
    try {
      await dispatch(registerUser({ username, password })).unwrap();
    } catch (err) {
      throw err;
    }
  };

  const signOut = () => {
    dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return { 
    user, 
    isAuthenticated, 
    loading, 
    error, 
    login: signIn, 
    register: signUp,
    signOut,
    clearError: clearAuthError
  };
};