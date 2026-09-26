import crypto from "crypto";

export interface InitializePaystackOptions {
  email: string;
  amount: number; // in normal currency units (e.g., 100.00 KES/USD/NGN)
  currency?: string;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaystackInitResponse {
  success: boolean;
  authorizationUrl?: string;
  accessCode?: string;
  reference?: string;
  error?: string;
}

export interface PaystackVerifyResponse {
  success: boolean;
  status?: string; // "success", "failed", "abandoned", etc.
  reference?: string;
  amount?: number; // in sub-units (e.g. kobo/cents)
  currency?: string;
  customer?: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
  error?: string;
}

export async function initializePaystackTransaction(
  options: InitializePaystackOptions
): Promise<PaystackInitResponse> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.warn("[Paystack Warning] PAYSTACK_SECRET_KEY is not defined. Using mock response.");
    return {
      success: true,
      authorizationUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/cart/verify?reference=${options.reference}`,
      accessCode: `mock_code_${options.reference}`,
      reference: options.reference,
    };
  }

  // Paystack expects amount in sub-units (e.g., 1000 KES = 100000 cents)
  const amountInSubunits = Math.round(options.amount * 100);
  const currency = options.currency || process.env.PAYSTACK_CURRENCY || "KES";

  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        email: options.email,
        amount: amountInSubunits,
        currency,
        reference: options.reference,
        callback_url: options.callbackUrl,
        metadata: options.metadata || {},
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("[Paystack Init Error]", data);
      return {
        success: false,
        error: data.message || "Failed to initialize Paystack transaction",
      };
    }

    return {
      success: true,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    };
  } catch (error: any) {
    console.error("[Paystack Init Exception]", error);
    return {
      success: false,
      error: error.message || "Network exception during Paystack initialization",
    };
  }
}

export async function verifyPaystackTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.warn("[Paystack Warning] PAYSTACK_SECRET_KEY is not defined. Mocking verify success.");
    return {
      success: true,
      status: "success",
      reference,
      amount: 10000,
      currency: "KES",
    };
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("[Paystack Verify Error]", data);
      return {
        success: false,
        error: data.message || "Failed to verify transaction with Paystack",
      };
    }

    const tx = data.data;
    return {
      success: tx.status === "success",
      status: tx.status,
      reference: tx.reference,
      amount: tx.amount,
      currency: tx.currency,
      customer: {
        email: tx.customer?.email,
        firstName: tx.customer?.first_name,
        lastName: tx.customer?.last_name,
        phone: tx.customer?.phone,
      },
      metadata: tx.metadata,
    };
  } catch (error: any) {
    console.error("[Paystack Verify Exception]", error);
    return {
      success: false,
      error: error.message || "Network exception during Paystack verification",
    };
  }
}

export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey || !signatureHeader) return false;

  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  return hash === signatureHeader;
}
