export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  provider: "resend" | "brevo" | "simulated";
  error?: string;
}

export interface OrderItemEmailData {
  id?: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  vendorId?: string;
  storeName?: string;
}

export interface OrderEmailData {
  orderId: string;
  reference: string;
  totalAmount: number;
  subtotalAmount?: number;
  shippingFee?: number;
  discountAmount?: number;
  currency?: string;
  fulfillmentType: "delivery" | "pickup";
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
    country?: string;
  };
  pickupStation?: {
    name: string;
    address: string;
    city: string;
    operatingHours: string;
    phoneNumber: string;
  };
  pickupCode?: string;
  items: OrderItemEmailData[];
  createdAt?: string | Date;
}
