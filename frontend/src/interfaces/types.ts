export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  name: string;
  email: string;
  role?: Role; // Added role field assuming it's available in the decoded token
  id?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LockerMini {
  id: string;
  status: string; // "AVAILABLE" | "OCCUPIED" | "MAINTENANCE"
}

export interface LockerPoint {
  id: string;
  name: string;
  address?: string;
  city_id: string;
  lockers?: LockerMini[];
}

export interface City {
  id: string;
  name: string;
  locker_points?: LockerPoint[];
}

export interface State {
  id: string;
  name: string;
  cities?: City[];
}

export interface Locker {
  id: string;
  name: string;
  status: string;
  locker_point_name: string;
  locker_point_id?: string; // from LockerCreateResponse
}

export interface ItemCreate {
  name: string;
  locker_id: string;
  your_email: string;
  receiver_phone_number: string;
  receiver_emailid: string;
  description?: string;
}

export interface Item {
  id: number;
  name?: string;
  description?: string;
  locker_id: string;
  your_email: string;
  receiver_phone: string;
  receiver_email: string;
  status: string;
  created_at: string;
}

export interface Transaction {
  item_id: number;
  locker_id: string;
  total_amount?: number;
  detail?: string;
}
