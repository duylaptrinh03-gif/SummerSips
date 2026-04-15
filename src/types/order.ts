export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: CartItem[];
  total: number;
  createdAt: string;
}
