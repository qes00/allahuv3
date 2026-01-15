export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UploadResponse {
  message: string;
  imageUrl: string;
}

export enum FetchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// User Profile Types
export interface UserAddress {
  id: string;
  street: string;
  district: string; // Distrito
  province: string; // Provincia
  department: string; // Departamento
  reference?: string;
}

export interface PaymentMethod {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  token: string; // Secure token from gateway, NOT the card number
  expiry: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: 'DNI' | 'RUC' | 'CE';
  documentNumber: string;
  addresses: UserAddress[];
  savedCards: PaymentMethod[];
}