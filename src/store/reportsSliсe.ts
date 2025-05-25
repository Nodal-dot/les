import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchReports, createReportRecord } from '../api';
import { Report } from './types';

interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
  lastCreated: Report | null;
}

const initialState: ReportsState = {
  reports: [],
  loading: false,
  error: null,
  lastCreated: null
};

export const fetchReportsAction = createAsyncThunk(
  'reports/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchReports();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки отчетов');
    }
  }
);

export const createReportAction = createAsyncThunk(
  'reports/create',
  async (
    { username, sensorId, reportType }: 
    { username: string; sensorId: string; reportType: 'png' | 'pdf' | 'txt' },
    { rejectWithValue }
  ) => {
    try {
      await createReportRecord(username, sensorId, reportType);
      return await fetchReports();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания отчета');
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearLastCreated(state) {
      state.lastCreated = null;
    },
    setReportsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReportsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(createReportAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReportAction.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
        state.lastCreated = action.payload[action.payload.length - 1];
      })
      .addCase(createReportAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearLastCreated, setReportsError } = reportsSlice.actions;
export default reportsSlice.reducer;