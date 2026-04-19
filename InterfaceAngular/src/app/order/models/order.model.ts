export interface OrderItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  itemStatus: string;
}

export interface Order {
  id: number;
  clientName: string;
  serverName: string;
  tableNumber: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItemCreate {
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderCreate {
  clientName: string;
  serverName: string;
  tableNumber: number;
  items: OrderItemCreate[];
}