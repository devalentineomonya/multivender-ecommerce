declare module "@paystack/inline-js" {
  export interface PaystackTransaction {
    id: string | number;
    reference: string;
    message?: string;
    status?: string;
  }

  export interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    reference?: string;
    metadata?: Record<string, any>;
    channels?: string[];
    onSuccess?: (transaction: PaystackTransaction) => void;
    onCancel?: () => void;
    onError?: (error: { message: string }) => void;
    onLoad?: (response: any) => void;
  }

  export default class PaystackPop {
    constructor();
    newTransaction(options: PaystackOptions): any;
    resumeTransaction(
      accessCode: string,
      callbacks?: {
        onSuccess?: (transaction: PaystackTransaction) => void;
        onCancel?: () => void;
        onError?: (error: { message: string }) => void;
        onLoad?: (response: any) => void;
      }
    ): any;
    cancelTransaction(transaction: any): void;
  }
}
