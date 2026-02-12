export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  minStockAlert: number;
  expiryDate?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  district: string;
  details: string;
  isDefault: boolean;
}

export interface SkinProfile {
  type: 'Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Normal' | '';
  concerns: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
  addresses: Address[];
  wishlist: string[];
  skinProfile: SkinProfile;
  rewardPoints: number;
  joinedAt: string;
}

export type PaymentMethod = 'COD' | 'bKash' | 'Nagad' | 'Rocket';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: PaymentMethod;
  paymentStatus: 'Unpaid' | 'Paid' | 'Verification Required';
  transactionId?: string;
  trackingId?: string;
  courier?: string;
  shippingAddress?: Address;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  description: string;
  expiresAt: string;
  usageCount: number;
}