export interface User {
  id: number;
  username: string;
  role: 'user' | 'moderator' | 'admin';
  company: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
}

export interface RootState {
  auth: AuthState;
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
    userId?: number;
    username?: string;
    role?: string;
  };
  sensor?: {
    sensorId: string;
    networkId: string;
  };
  message: string;
  status: string;
  read: boolean;
  timestamp: string;
}
export interface SensorDataResponse {
  data: Record<string, any>[];
  headers: string[];
  sensorId: string;
  networkId: string;
  fileName: string;
}
export interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  user: User;
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

export interface SensorData {
  [key: string]: string | number; 
}

export interface SensorDetails {
  id: string;
  networkId: string;
  sensorId?: string;
  name: string;
  location: string;
  type: string;
  lastUpdated: string;
  region: string;
  isActive: boolean;
  company: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  data?: SensorData[];
}

export interface NetworkDetails {
  id: string;
  name: string;
  company: string;
  description?: string;
  createdAt: string;
  sensorsCount: number;
  sensors?: SensorDetails[]; 
}