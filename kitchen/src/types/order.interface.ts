export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  category: 'MAIN' | 'APPETIZER' | 'DESSERT' | 'DRINK';
  specialNotes?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  status: 'NOUVELLE' | 'EN_COURS' | 'PRETE' | 'SERVIE';
  items: OrderItem[];
  timeElapsed: number; // in minutes
  estimatedTime: number; // in minutes
  specialNotes?: string[];
  isUrgent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface KitchenStats {
  totalActive: number;
  averageTime: number;
  systemStatus: 'ON' | 'OFF';
  newOrders: number;
  inProgress: number;
  ready: number;
}