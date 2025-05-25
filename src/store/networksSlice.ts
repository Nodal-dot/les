import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchNetworks as apiFetchNetworks,
  fetchNetworkSensors as apiFetchNetworkSensors,
  fetchSensorData as apiFetchSensorData,
} from '../api';
import { RootState } from './index';
import { NetworkDetails, SensorDetails, SensorData } from './types';

interface NetworksState {
  networks: NetworkDetails[];
  currentNetwork: NetworkDetails | null;
  sensors: SensorDetails[];
  currentSensor: SensorDetails | null;
  loading: boolean;
  error: string | null;
  sensorData: Record<string, any>[];
  sensorDataHeaders: string[];
}

const initialState: NetworksState = {
  networks: [],
  currentNetwork: null,
  sensors: [],
  currentSensor: null,
  sensorData: [],
  loading: false,
  error: null,
  sensorDataHeaders: []
};

export const fetchNetworks = createAsyncThunk(
  'networks/fetchNetworks',
  async (company: string | null, { rejectWithValue }) => {
    try {
      return await apiFetchNetworks(company || undefined);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch networks');
    }
  }
);

export const fetchNetworkSensors = createAsyncThunk(
  'networks/fetchNetworkSensors',
  async (networkId: string, { rejectWithValue }) => {
    try {
      return {
        networkId,
        sensors: await apiFetchNetworkSensors(networkId),
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sensors');
    }
  }
);

export const fetchSensorData = createAsyncThunk(
  'networks/fetchSensorData',
  async ({ networkId, sensorId }: { networkId: string; sensorId: string }, { rejectWithValue }) => {
    try {
      const response = await apiFetchSensorData(networkId, sensorId);
      return {
        networkId,
        sensorId,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sensor data');
    }
  }
);

const networksSlice = createSlice({
  name: 'networks',
  initialState,
  reducers: {
    setCurrentNetwork(state, action: { payload: string | null }) {
      if (action.payload === null) {
        state.currentNetwork = null;
      } else {
        state.currentNetwork = state.networks.find(n => n.id === action.payload) || null;
      }
    },
    setCurrentSensor(state, action: { payload: string | null }) {
      if (action.payload === null) {
        state.currentSensor = null;
      } else {
        state.currentSensor = state.sensors.find(s => s.id === action.payload) || null;
      }
    },
    clearSensorData(state) {
      state.sensorData = [];
      state.sensorDataHeaders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchNetworks
      .addCase(fetchNetworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNetworks.fulfilled, (state, action) => {
        state.loading = false;
        state.networks = action.payload;
      })
      .addCase(fetchNetworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch networks';
      })
      
      // Handle fetchNetworkSensors
      .addCase(fetchNetworkSensors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNetworkSensors.fulfilled, (state, action) => {
        state.loading = false;
        state.sensors = action.payload.sensors;
        // Update current network if it's the one we're viewing
        if (state.currentNetwork?.id === action.payload.networkId) {
          state.currentNetwork = {
            ...state.currentNetwork,
            sensors: action.payload.sensors,
          };
        }
      })
      .addCase(fetchNetworkSensors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch sensors';
      })
      
      // Handle fetchSensorData
      .addCase(fetchSensorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSensorData.fulfilled, (state, action) => {
        state.loading = false;
        state.sensorData = action.payload.data;
        state.sensorDataHeaders = action.payload.headers;
        // Update current sensor if it's the one we're viewing
        if (state.currentSensor?.id === action.payload.sensorId) {
          state.currentSensor = {
            ...state.currentSensor,
            data: action.payload.data,
          };
        }
      })
      .addCase(fetchSensorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch sensor data';
      });
  },
});

export const { setCurrentNetwork, setCurrentSensor, clearSensorData } = networksSlice.actions;

export default networksSlice.reducer;

// Selectors
export const selectNetworks = (state: RootState) => state.networks.networks;
export const selectCurrentNetwork = (state: RootState) => state.networks.currentNetwork;
export const selectSensors = (state: RootState) => state.networks.sensors;
export const selectCurrentSensor = (state: RootState) => state.networks.currentSensor;
export const selectSensorData = (state: RootState) => state.networks.sensorData;
export const selectSensorDataHeaders = (state: RootState) => state.networks.sensorDataHeaders;
export const selectNetworksLoading = (state: RootState) => state.networks.loading;
export const selectNetworksError = (state: RootState) => state.networks.error;
