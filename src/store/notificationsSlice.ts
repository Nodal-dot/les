import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Notification, 
  User, 
  fetchNotifications, 
  markNotificationAsRead, 
  updateNotificationStatus 
} from '../api';

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
};

export const loadNotifications = createAsyncThunk(
  'notifications/load',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: User | null } };
      if (!auth.user) throw new Error('User not authenticated');
      
      return await fetchNotifications(auth.user.username, auth.user.role);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await markNotificationAsRead(notificationId);
      return notificationId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const changeNotificationStatus = createAsyncThunk(
  'notifications/changeStatus',
  async (
    payload: { id: string; status: 'approved' | 'rejected' | 'acknowledged' },
    { rejectWithValue }
  ) => {
    try {
      await updateNotificationStatus(payload.id, payload.status);
      return payload;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(loadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markAsRead.fulfilled, (state, action: PayloadAction<string>) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification) {
          notification.read = true;
        }
      })
      .addCase(changeNotificationStatus.fulfilled, (
        state, 
        action: PayloadAction<{ id: string; status: 'approved' | 'rejected' | 'acknowledged' }>
      ) => {
        const notification = state.notifications.find(n => n.id === action.payload.id);
        if (notification) {
          notification.status = action.payload.status;
          notification.read = true;
        }
      });
  },
});

export default notificationsSlice.reducer;