import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from './authSlice';
import notificationsReducer from './notificationsSlice';
import networksReducer from './networksSlice';
import reportsReducer from './reportsSliсe';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
      networks: networksReducer,
      reports: reportsReducer

  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;