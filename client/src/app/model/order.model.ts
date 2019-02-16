export interface Order {
  id: string;
  cart: string;
  total: number;
  city: string;
  street: string;
  dateOfDelivery: Date;
  dateOfOrder: Date;
  creditCard: number;
}
