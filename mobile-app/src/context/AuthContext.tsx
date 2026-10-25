import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'customer' | 'dealer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  businessName?: string;
  gstNumber?: string;
  dealerStatus?: 'approved' | 'pending' | 'rejected';
  referralCode: string;
  referralEarnings: number;
  referralCount: number;
  savedAddress?: string;
  coordinates?: { lat: number; lng: number };
}

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  isDealer: boolean;
  isAdmin: boolean;
  loginAsCustomer: () => void;
  loginAsDealer: (dealerInfo?: { businessName: string; gstNumber: string }) => void;
  loginAsAdmin: () => void;
  switchRole: (newRole: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultCustomer: UserProfile = {
  id: 'usr-cust-991',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  role: 'customer',
  referralCode: 'CALI-RAHUL-50',
  referralEarnings: 750,
  referralCount: 3,
  savedAddress: 'Flat 402, Aqua Heights, Indiranagar, Bengaluru, 560038',
  coordinates: { lat: 12.9716, lng: 77.5946 }
};

const defaultDealer: UserProfile = {
  id: 'usr-dlr-304',
  name: 'Vikram Enterprises (Pvt Ltd)',
  email: 'vikram.watertech@gmail.com',
  phone: '+91 98450 11223',
  role: 'dealer',
  businessName: 'Vikram RO Solutions & Spares Distribution',
  gstNumber: '29ABCDE1234F1Z5',
  dealerStatus: 'approved',
  referralCode: 'DEALER-VIKRAM-VIP',
  referralEarnings: 4500,
  referralCount: 12,
  savedAddress: 'Plot 18, Peenya Industrial Area Phase 2, Bengaluru, 560058',
  coordinates: { lat: 13.0285, lng: 77.5195 }
};

const AuthContext = createContext<AuthContextType>({
  user: defaultCustomer,
  role: 'customer',
  isDealer: false,
  isAdmin: false,
  loginAsCustomer: () => {},
  loginAsDealer: () => {},
  loginAsAdmin: () => {},
  switchRole: () => {},
  updateProfile: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultCustomer);

  const loginAsCustomer = () => {
    setUser(defaultCustomer);
  };

  const loginAsDealer = (dealerInfo?: { businessName: string; gstNumber: string }) => {
    setUser({
      ...defaultDealer,
      ...(dealerInfo?.businessName ? { businessName: dealerInfo.businessName } : {}),
      ...(dealerInfo?.gstNumber ? { gstNumber: dealerInfo.gstNumber } : {})
    });
  };

  const loginAsAdmin = () => {
    setUser({
      id: 'usr-admin-001',
      name: 'Califnco Operations Admin',
      email: 'admin@califnco.com',
      phone: '+91 80 4000 8888',
      role: 'admin',
      referralCode: 'ADMIN-DIRECT',
      referralEarnings: 0,
      referralCount: 0,
      savedAddress: 'Califnco Tech Park, Whitefield, Bengaluru',
      coordinates: { lat: 12.9698, lng: 77.7499 }
    });
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'dealer') {
      loginAsDealer();
    } else if (newRole === 'admin') {
      loginAsAdmin();
    } else {
      loginAsCustomer();
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const role = user.role;
  const isDealer = role === 'dealer';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isDealer,
        isAdmin,
        loginAsCustomer,
        loginAsDealer,
        loginAsAdmin,
        switchRole,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
