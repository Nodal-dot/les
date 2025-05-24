import { Notification } from '../store/notificationsSlice';
import fs from 'fs';
import path from 'path';

// Путь к файлу notifications/info.json
const notificationsPath = path.join(__dirname, '../db/notifications/info.json');

// Функция для чтения данных из файла
const readNotifications = (): any[] => {
  try {
    const data = fs.readFileSync(notificationsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading notifications file:', error);
    return [];
  }
};

// Функция для записи данных в файл
const writeNotifications = (data: any[]): void => {
  try {
    fs.writeFileSync(notificationsPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing notifications file:', error);
  }
};

export const mockNotificationsApi = {
  get: async (username: string, userRole: string): Promise<Notification[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    const notificationsData = readNotifications();
    const userNotifications = notificationsData.filter(notif => 
      (notif.recipient.role && notif.recipient.role === userRole) ||
      (notif.recipient.username && notif.recipient.username === username)
    );
    
    return userNotifications.map(notif => ({
      ...notif,
      read: false,
      status: notif.type === 'access_request' ? 'pending' : 'acknowledged'
    })) as Notification[];
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const notifications = readNotifications();
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    
    writeNotifications(updatedNotifications);
    console.log(`Notification ${notificationId} marked as read`);
  },

  updateStatus: async (
    notificationId: string, 
    status: 'approved' | 'rejected' | 'acknowledged'
  ): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const notifications = readNotifications();
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, status } : notif
    );
    
    writeNotifications(updatedNotifications);
    console.log(`Notification ${notificationId} status updated to ${status}`);
  }
};