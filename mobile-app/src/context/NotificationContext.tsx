import React, { createContext, useContext, useState } from 'react';

export interface PushAlert {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'order' | 'service' | 'dealer' | 'promo';
  read: boolean;
}

interface NotificationContextType {
  notifications: PushAlert[];
  unreadCount: number;
  bannerAlert: PushAlert | null;
  triggerPushAlert: (title: string, body: string, type?: PushAlert['type']) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearBanner: () => void;
}

const initialAlerts: PushAlert[] = [
  {
    id: 'notif-1',
    title: '💧 Pure Water Milestone',
    body: 'Your Califnco AquaShield Purifier has filtered 500 Litres of mineral water this month!',
    timestamp: '10 mins ago',
    type: 'promo',
    read: false
  },
  {
    id: 'notif-2',
    title: '🚚 Order Dispatched',
    body: 'Order #ORD-CAL-2026-9041 is out for delivery with tracking #BLR-EXP-882190.',
    timestamp: '2 hours ago',
    type: 'order',
    read: false
  },
  {
    id: 'notif-3',
    title: '💼 Dealer Bulk Special',
    body: 'Extra 5% wholesale rebate on 100 GPD Booster Pumps this weekend for verified dealers.',
    timestamp: '1 day ago',
    type: 'dealer',
    read: true
  }
];

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  bannerAlert: null,
  triggerPushAlert: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearBanner: () => {}
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<PushAlert[]>(initialAlerts);
  const [bannerAlert, setBannerAlert] = useState<PushAlert | null>(null);

  const triggerPushAlert = (title: string, body: string, type: PushAlert['type'] = 'order') => {
    const alert: PushAlert = {
      id: `push-${Date.now()}`,
      title,
      body,
      timestamp: 'Just now',
      type,
      read: false
    };

    setNotifications(prev => [alert, ...prev]);
    setBannerAlert(alert);

    // Auto dismiss top banner after 5 seconds
    setTimeout(() => {
      setBannerAlert(prev => (prev?.id === alert.id ? null : prev));
    }, 5000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearBanner = () => {
    setBannerAlert(null);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        bannerAlert,
        triggerPushAlert,
        markAsRead,
        markAllAsRead,
        clearBanner
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
