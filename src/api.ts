import axios from 'axios';
import { 
  LoginResponse, 
  Network, 
  Sensor,
  Notification, 
  User, 
  SensorDetails, 
  NetworkDetails, 
  SensorDataResponse,
  Report
} from './store/types';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', { username, password });
  return response.data;
};

export const register = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/register', { username, password });
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
  status: string
): Promise<void> => {
  await api.put(`/notifications/${notificationId}/status`, { status });
};

export const respondToAccessRequest = async (
  notificationId: string,
  response: 'approved' | 'rejected'
): Promise<void> => {
  await api.post('/notifications/respond-access', {
    notificationId,
    response
  });
};

export const requestCompanyAccess = async (
  requesterUsername: string, 
  company: string,
  adminUsername: string
): Promise<void> => {
  await api.post('/notifications/request-access', {
    requesterUsername,
    company,
    adminUsername
  });
};

export const fetchUsers = async (company?: string): Promise<User[]> => {
  const params = company ? { company } : {};
  const response = await api.get<User[]>('/users', { params });
  return response.data;
};

export const updateUserRole = async (
  username: string,
  role: 'user' | 'moderator' | 'admin'
): Promise<void> => {
  await api.put(`/users/${username}`, { role });
};

export const deleteUser = async (username: string): Promise<void> => {
  await api.put(`/users/${username}`, { action: 'delete' });
};

export const fetchNetworks = async (company?: string): Promise<NetworkDetails[]> => {
  const params = company ? { company } : {};
  const response = await api.get<NetworkDetails[]>('/networks', { params });
  return response.data;
};

export const fetchSensors = async (networkId: string): Promise<Sensor[]> => {
  const response = await api.get<Sensor[]>(`/networks/${networkId}/sensors`);
  return response.data;
};

export const fetchNetworkSensors = async (networkId: string): Promise<SensorDetails[]> => {
  const response = await api.get<SensorDetails[]>(`/networks/${networkId}/sensors`);
  return response.data;
};

export const fetchSensorData = async (
  networkId: string, 
  sensorId: string
): Promise<SensorDataResponse> => {
  const response = await api.get<SensorDataResponse>(
    `/networks/${networkId}/sensors/${sensorId}/data`
  );
  return response.data;
};

export const requestSensorAccess = async (
  requesterUsername: string,
  sensorId: string,
  networkId: string,
  company: string
): Promise<void> => {
  await api.post('/notifications/request-sensor-access', {
    requesterUsername,
    sensorId,
    networkId,
    company
  });
};

export const fetchReports = async (): Promise<Report[]> => {
  const response = await api.get<Report[]>('/reports');
  console.log(api.defaults.baseURL)
  return response.data;
};

export const createReportRecord = async (
  username: string,
  sensorId: string,
  reportType: string
): Promise<void> => {
  await api.post('/reports', {
    username,
    sensorId,
    reportType,
    timestamp: new Date().toISOString()
  });
};

export const downloadReport = {
  png: async (username: string, sensorId: string): Promise<void> => {
    await createReportRecord(username, sensorId, 'png');
  },
  pdf: async (username: string, sensorId: string): Promise<void> => {
    await createReportRecord(username, sensorId, 'pdf');
  },
  txt: async (username: string, sensorId: string): Promise<void> => {
    await createReportRecord(username, sensorId, 'txt');
  }
};