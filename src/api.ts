import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',

});

export interface User {
  id: number;
  username: string;
  role: string;
  name: string;
}

export interface LoginResponse {
  user: User;
}

export interface Notification {
  id: string;
  type: 'access_request' | 'direct_message' | 'system_alert';
  sender?: {
    userId?: number;
    username: string;
    role: string;
  };
  recipient: {
    username?: string;
    role?: string;
  };
  sensor?: {
    sensorId: string;
    networkId: string;
  };
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'acknowledged';
  read: boolean;
  timestamp: string;
}

export interface Network {
  id: string;
  name: string;
  users: string[];
}

export interface Sensor {
  sensorId: string;
  location: string;
  lastUpdated: string;
  isActive: boolean;
  accessUsers: string[];
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  networkId: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', { username, password });
  return response.data;
};

export const fetchNotifications = async (username: string, role: string): Promise<Notification[]> => {
  const response = await api.get<Notification[]>('/notifications', { params: { username, role } });
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await api.put(`/notifications/${notificationId}/read`);
};

export const updateNotificationStatus = async (
  notificationId: string, 
  status: 'approved' | 'rejected' | 'acknowledged'
): Promise<void> => {
  await api.put(`/notifications/${notificationId}/status`, { status });
};

export const fetchNetworks = async (): Promise<Network[]> => {
  const response = await api.get<Network[]>('/networks');
  return response.data;
};

export const fetchSensors = async (networkId: string): Promise<Sensor[]> => {
  const response = await api.get<Sensor[]>(`/networks/${networkId}/sensors`);
  return response.data;
};

export const fetchSensorData = async (networkId: string, sensorId: string): Promise<any[]> => {
  const response = await api.get<any[]>(`/networks/${networkId}/sensors/${sensorId}/data`);
  return response.data;
};