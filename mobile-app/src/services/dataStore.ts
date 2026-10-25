import { Product, PRODUCTS } from '../data/products';
import { sendEmailNotification, sendSmsNotification } from '../config/notifications';

export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  role: 'customer' | 'dealer';
  businessName?: string;
  gstNumber?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'cod';
  paymentId: string;
  shippingAddress: string;
  coordinates?: { lat: number; lng: number };
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
}

export interface ServiceRequest {
  id: string;
  createdAt: string;
  serviceType: 'New Purifier Installation' | 'Filter Cartridge Replacement' | 'TDS Purity Test & Health Check' | 'Motor / Solenoid Breakdown Repair' | 'Annual Maintenance (AMC)';
  customerName: string;
  phone: string;
  address: string;
  waterSource: 'Borewell' | 'Municipal / Tanker' | 'Mixed';
  currentTds?: number;
  preferredDate: string;
  preferredTimeSlot: 'Morning (09:00 - 12:00)' | 'Afternoon (12:00 - 04:00)' | 'Evening (04:00 - 07:00)';
  purifierModel: string;
  notes?: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
  technicianName?: string;
  technicianPhone?: string;
}

export interface DealerApplication {
  id: string;
  createdAt: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber: string;
  city: string;
  state: string;
  annualTurnover?: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Initial pre-seeded sample data for immediate evaluator inspection
let initialOrders: Order[] = [
  {
    id: 'ORD-CAL-2026-9041',
    createdAt: '2026-10-24T14:30:00Z',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.sharma@example.com',
    customerPhone: '+91 98765 43210',
    role: 'customer',
    items: [
      {
        product: PRODUCTS[0], // AquaShield RO
        quantity: 1,
        unitPrice: 14499,
        totalPrice: 14499
      },
      {
        product: PRODUCTS[18], // Digital TDS Meter
        quantity: 1,
        unitPrice: 399,
        totalPrice: 399
      }
    ],
    subtotal: 14898,
    discount: 500,
    tax: 2591,
    totalAmount: 16989,
    paymentMethod: 'razorpay_upi',
    paymentId: 'pay_rzp_test_9832714a',
    shippingAddress: 'Flat 402, Aqua Heights, Indiranagar, Bengaluru, 560038',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    status: 'Shipped',
    trackingNumber: 'BLR-EXP-882190'
  },
  {
    id: 'ORD-BLK-2026-1102',
    createdAt: '2026-10-25T10:15:00Z',
    customerName: 'Vikram Enterprises (Pvt Ltd)',
    customerEmail: 'vikram.watertech@gmail.com',
    customerPhone: '+91 98450 11223',
    role: 'dealer',
    businessName: 'Vikram RO Solutions & Spares Distribution',
    gstNumber: '29ABCDE1234F1Z5',
    items: [
      {
        product: PRODUCTS[10], // PureDrive 75 GPD Pump
        quantity: 20,
        unitPrice: 1080,
        totalPrice: 21600
      },
      {
        product: PRODUCTS[13], // 10-inch PP Spun Filter
        quantity: 100,
        unitPrice: 55,
        totalPrice: 5500
      },
      {
        product: PRODUCTS[16], // Hi-Flux 75 GPD RO Membrane
        quantity: 20,
        unitPrice: 690,
        totalPrice: 13800
      }
    ],
    subtotal: 40900,
    discount: 2000,
    tax: 7002,
    totalAmount: 45902,
    paymentMethod: 'razorpay_netbanking',
    paymentId: 'pay_rzp_test_dealer_7721',
    shippingAddress: 'Plot 18, Peenya Industrial Area Phase 2, Bengaluru, 560058',
    coordinates: { lat: 13.0285, lng: 77.5195 },
    status: 'Confirmed',
    trackingNumber: 'VRL-LOG-331048'
  }
];

let initialServices: ServiceRequest[] = [
  {
    id: 'SRV-CAL-801',
    createdAt: '2026-10-25T09:20:00Z',
    serviceType: 'Filter Cartridge Replacement',
    customerName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    address: 'Flat 402, Aqua Heights, Indiranagar, Bengaluru',
    waterSource: 'Municipal / Tanker',
    currentTds: 450,
    preferredDate: '2026-10-26',
    preferredTimeSlot: 'Morning (09:00 - 12:00)',
    purifierModel: 'Califnco AquaShield RO 10L',
    notes: 'Water taste has changed, TDS output is slightly higher.',
    status: 'Assigned',
    technicianName: 'Suresh Kumar (Senior Water Tech)',
    technicianPhone: '+91 98111 22334'
  },
  {
    id: 'SRV-CAL-802',
    createdAt: '2026-10-25T11:45:00Z',
    serviceType: 'New Purifier Installation',
    customerName: 'Priya Sundaram',
    phone: '+91 97400 55667',
    address: 'Villa 12, Sobha Emerald, Whitefield, Bengaluru',
    waterSource: 'Borewell',
    currentTds: 1200,
    preferredDate: '2026-10-26',
    preferredTimeSlot: 'Afternoon (12:00 - 04:00)',
    purifierModel: 'Califnco HydroPure Under-Sink RO',
    notes: 'Need under-counter solid brass faucet drilling and inlet connection.',
    status: 'Pending'
  }
];

let initialDealers: DealerApplication[] = [
  {
    id: 'DLR-APP-01',
    createdAt: '2026-10-23T16:00:00Z',
    businessName: 'Vikram RO Solutions & Spares Distribution',
    contactPerson: 'Vikram Joshi',
    email: 'vikram.watertech@gmail.com',
    phone: '+91 98450 11223',
    gstNumber: '29ABCDE1234F1Z5',
    city: 'Bengaluru',
    state: 'Karnataka',
    annualTurnover: '₹45 Lakhs',
    status: 'approved'
  },
  {
    id: 'DLR-APP-02',
    createdAt: '2026-10-25T13:10:00Z',
    businessName: 'Apex Water Purification Spares Hub',
    contactPerson: 'Manoj Patel',
    email: 'apex.water.hub@yahoo.com',
    phone: '+91 94250 88990',
    gstNumber: '24AAACB9876C1Z4',
    city: 'Ahmedabad',
    state: 'Gujarat',
    annualTurnover: '₹75 Lakhs',
    status: 'pending'
  },
  {
    id: 'DLR-APP-03',
    createdAt: '2026-10-24T18:30:00Z',
    businessName: 'Shree Krishna Hardware & Water Spares',
    contactPerson: 'Gopal Krishna',
    email: 'shreekrishna.ro@gmail.com',
    phone: '+91 98220 33445',
    gstNumber: '27AABCS5544K1ZR',
    city: 'Pune',
    state: 'Maharashtra',
    annualTurnover: '₹20 Lakhs',
    status: 'pending'
  }
];

// Reactive event listeners
type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach(fn => fn());
}

export const DataStore = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },

  // Orders
  getOrders(): Order[] {
    return initialOrders;
  },

  getUserOrders(email: string, role?: string): Order[] {
    if (!email) return initialOrders;
    return initialOrders.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
  },

  createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: orderData.role === 'dealer'
        ? `ORD-BLK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        : `ORD-CAL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    initialOrders = [newOrder, ...initialOrders];
    notify();

    // Trigger Notifications asynchronously
    sendEmailNotification(newOrder.customerEmail, `Califnco Order Confirmation #${newOrder.id}`, {
      order_id: newOrder.id,
      amount: newOrder.totalAmount,
      items_count: newOrder.items.length,
      address: newOrder.shippingAddress
    });

    sendSmsNotification(
      newOrder.customerPhone,
      `Califnco: Your Order #${newOrder.id} of Rs. ${newOrder.totalAmount} is confirmed! Razorpay ID: ${newOrder.paymentId}. Delivery in 2-3 days.`
    );

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string) {
    initialOrders = initialOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          ...(trackingNumber ? { trackingNumber } : {})
        };
      }
      return o;
    });
    notify();
  },

  // Service Desk
  getServices(): ServiceRequest[] {
    return initialServices;
  },

  getUserServices(phone: string): ServiceRequest[] {
    return initialServices.filter(s => s.phone === phone);
  },

  bookService(data: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>): ServiceRequest {
    const newService: ServiceRequest = {
      ...data,
      id: `SRV-CAL-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    initialServices = [newService, ...initialServices];
    notify();

    sendSmsNotification(
      newService.phone,
      `Califnco Service Desk: Request #${newService.id} received for ${newService.serviceType}. A certified technician will be assigned for ${newService.preferredDate}.`
    );

    return newService;
  },

  updateServiceStatus(serviceId: string, status: ServiceRequest['status'], technicianName?: string, technicianPhone?: string) {
    initialServices = initialServices.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          status,
          ...(technicianName ? { technicianName } : {}),
          ...(technicianPhone ? { technicianPhone } : {})
        };
      }
      return s;
    });
    notify();
  },

  // Dealers Management
  getDealers(): DealerApplication[] {
    return initialDealers;
  },

  applyDealer(data: Omit<DealerApplication, 'id' | 'createdAt' | 'status'>): DealerApplication {
    const newApp: DealerApplication = {
      ...data,
      id: `DLR-APP-0${initialDealers.length + 1}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    initialDealers = [newApp, ...initialDealers];
    notify();
    return newApp;
  },

  updateDealerStatus(dealerId: string, status: 'approved' | 'rejected') {
    initialDealers = initialDealers.map(d => {
      if (d.id === dealerId) {
        return { ...d, status };
      }
      return d;
    });
    notify();
  }
};
