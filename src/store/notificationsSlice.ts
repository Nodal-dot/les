import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { mockNotificationsApi } from '../mocks/mockNotifications';

export interface Notification {
  id: string;
  type: 'access_request' | 'direct_message';
  sender: {
    username: string;
    role: string;
  };
  recipient: {
    username: string;
    role: string;
  };
  sensor?: {
    sensorId: string;
    networkId: string;
  };
  message: string;
  timestamp: string;
  read?: boolean;
  status?: 'pending' | 'approved' | 'rejected' | 'acknowledged';
}

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

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (payload: { userId: number; userRole: string }, { rejectWithValue }) => {
    try {
      return await mockNotificationsApi.get(payload.userId.toString(), payload.userRole);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await mockNotificationsApi.markAsRead(notificationId);
      return notificationId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateNotificationStatus = createAsyncThunk(
  'notifications/updateStatus',
  async (
    payload: { id: string; status: 'approved' | 'rejected' | 'acknowledged' },
    { rejectWithValue }
  ) => {
    try {
      await mockNotificationsApi.updateStatus(payload.id, payload.status);
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
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification) {
          notification.read = true;
        }
      })
      .addCase(updateNotificationStatus.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload.id);
        if (notification) {
          notification.status = action.payload.status;
          notification.read = true;
        }
      });
  },
});
export default notificationsSlice.reducer;