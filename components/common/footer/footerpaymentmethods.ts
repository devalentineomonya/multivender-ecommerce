import visa from "@/public/images/63eb1ce82d440b7ab84a993f_visa.png";
import masterCard from "@/public/images/63eb1ce8f032504012a5896b_Mastercard.png";

export interface PaymentMethodItem {
  id: string;
  name: string;
  detail: string;
  tag: string;
  image?: any;
}

const footerPaymentMethod: PaymentMethodItem[] = [
  {
    id: "cards",
    name: "Cards",
    detail: "Visa, Mastercard, Verve",
    tag: "Card",
    image: visa,
  },
  {
    id: "mpesa",
    name: "Mobile Money",
    detail: "M-Pesa & Mobile Wallets",
    tag: "M-Pesa",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    detail: "Direct Bank Wire / EFT",
    tag: "Bank",
  },
  {
    id: "ussd",
    name: "USSD",
    detail: "Instant Secure USSD Code",
    tag: "USSD",
  },
];

export default footerPaymentMethod;
