import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from './types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state:AuthState ) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state:AuthState, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure(state:AuthState, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state:AuthState) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;