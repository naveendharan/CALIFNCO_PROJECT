import { PRODUCTS, Product } from '../data/products';

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
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
}

export interface ServiceTicket {
  id: string;
  createdAt: string;
  serviceType: string;
  customerName: string;
  phone: string;
  address: string;
  waterSource: string;
  currentTds?: number;
  preferredDate: string;
  preferredTimeSlot: string;
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

let ordersData: Order[] = [
  {
    id: 'ORD-CAL-2026-9041',
    createdAt: '2026-10-24T14:30:00Z',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.sharma@example.com',
    customerPhone: '+91 98765 43210',
    role: 'customer',
    items: [
      { product: PRODUCTS[0], quantity: 1, unitPrice: 14499, totalPrice: 14499 },
      { product: PRODUCTS[18], quantity: 1, unitPrice: 399, totalPrice: 399 }
    ],
    subtotal: 14898,
    discount: 500,
    tax: 2591,
    totalAmount: 16989,
    paymentMethod: 'razorpay_upi',
    paymentId: 'pay_rzp_test_9832714a',
    shippingAddress: 'Flat 402, Aqua Heights, Indiranagar, Bengaluru, 560038',
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
      { product: PRODUCTS[10], quantity: 20, unitPrice: 1080, totalPrice: 21600 },
      { product: PRODUCTS[13], quantity: 100, unitPrice: 55, totalPrice: 5500 },
      { product: PRODUCTS[16], quantity: 20, unitPrice: 690, totalPrice: 13800 }
    ],
    subtotal: 40900,
    discount: 2000,
    tax: 7002,
    totalAmount: 45902,
    paymentMethod: 'razorpay_netbanking',
    paymentId: 'pay_rzp_test_dealer_7721',
    shippingAddress: 'Plot 18, Peenya Industrial Area Phase 2, Bengaluru, 560058',
    status: 'Confirmed',
    trackingNumber: 'VRL-LOG-331048'
  },
  {
    id: 'ORD-BLK-2026-1103',
    createdAt: '2026-10-25T15:20:00Z',
    customerName: 'Apex Water Purification Spares Hub',
    customerEmail: 'apex.water.hub@yahoo.com',
    customerPhone: '+91 94250 88990',
    role: 'dealer',
    businessName: 'Apex Water Spares Hub',
    gstNumber: '24AAACB9876C1Z4',
    items: [
      { product: PRODUCTS[8], quantity: 2, unitPrice: 26500, totalPrice: 53000 }
    ],
    subtotal: 53000,
    discount: 0,
    tax: 9540,
    totalAmount: 62540,
    paymentMethod: 'razorpay_card',
    paymentId: 'pay_rzp_test_bulk_8832',
    shippingAddress: 'GIDC Industrial Estate, Vatva, Ahmedabad, 382445',
    status: 'Pending'
  }
];

let serviceTicketsData: ServiceTicket[] = [
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
  },
  {
    id: 'SRV-CAL-803',
    createdAt: '2026-10-25T14:10:00Z',
    serviceType: 'Motor / Solenoid Breakdown Repair',
    customerName: 'Amit Verma',
    phone: '+91 99887 66554',
    address: 'B-201, Green Glen Layout, Bellandur, Bengaluru',
    waterSource: 'Borewell',
    currentTds: 950,
    preferredDate: '2026-10-27',
    preferredTimeSlot: 'Morning (09:00 - 12:00)',
    purifierModel: 'Califnco PureDrive 100 GPD System',
    notes: 'Booster pump making vibrating noise and low reject water flow.',
    status: 'In Progress',
    technicianName: 'Ramesh Naidu',
    technicianPhone: '+91 98777 44112'
  }
];

let dealersData: DealerApplication[] = [
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

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach(fn => fn());
}

export const AdminDataStore = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  getOrders(): Order[] {
    return ordersData;
  },

  updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string) {
    ordersData = ordersData.map(o => {
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

  getServices(): ServiceTicket[] {
    return serviceTicketsData;
  },

  assignTechnician(ticketId: string, technicianName: string, technicianPhone: string) {
    serviceTicketsData = serviceTicketsData.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'Assigned',
          technicianName,
          technicianPhone
        };
      }
      return t;
    });
    notify();
  },

  updateServiceStatus(ticketId: string, status: ServiceTicket['status']) {
    serviceTicketsData = serviceTicketsData.map(t => {
      if (t.id === ticketId) {
        return { ...t, status };
      }
      return t;
    });
    notify();
  },

  getDealers(): DealerApplication[] {
    return dealersData;
  },

  updateDealerStatus(dealerId: string, status: 'approved' | 'rejected') {
    dealersData = dealersData.map(d => {
      if (d.id === dealerId) {
        return { ...d, status };
      }
      return d;
    });
    notify();
  },

  getAnalytics() {
    const totalRevenue = ordersData.reduce((sum, o) => sum + o.totalAmount, 0);
    const dealerRevenue = ordersData.filter(o => o.role === 'dealer').reduce((sum, o) => sum + o.totalAmount, 0);
    const retailRevenue = ordersData.filter(o => o.role === 'customer').reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = ordersData.filter(o => o.status === 'Pending').length;
    const pendingTickets = serviceTicketsData.filter(t => t.status === 'Pending').length;
    const approvedDealers = dealersData.filter(d => d.status === 'approved').length;
    const pendingDealers = dealersData.filter(d => d.status === 'pending').length;

    return {
      totalRevenue,
      dealerRevenue,
      retailRevenue,
      totalOrders: ordersData.length,
      pendingOrders,
      totalTickets: serviceTicketsData.length,
      pendingTickets,
      approvedDealers,
      pendingDealers,
      totalCatalogItems: PRODUCTS.length
    };
  }
};
