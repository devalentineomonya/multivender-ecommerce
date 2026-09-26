import { SendEmailOptions, EmailResult, OrderEmailData, OrderItemEmailData } from "./types";
import { sendWithResend } from "./providers/resend";
import { sendWithBrevo } from "./providers/brevo";
import { generateCustomerReceiptHtml } from "./templates/customer-order-receipt";
import { generateVendorAlertHtml } from "./templates/vendor-order-alert";
import { generateAdminAlertHtml } from "./templates/admin-order-alert";
import { generateStatusUpdateHtml } from "./templates/order-status-update";

export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  const preferredProvider = (process.env.EMAIL_PROVIDER || "resend").toLowerCase();

  // If Resend is preferred
  if (preferredProvider === "resend") {
    if (process.env.RESEND_API_KEY) {
      const res = await sendWithResend(options);
      if (res.success) return res;
      console.warn("[Email Fallback] Resend failed, trying Brevo...", res.error);
    }
    if (process.env.BREVO_API_KEY) {
      return await sendWithBrevo(options);
    }
  }

  // If Brevo is preferred
  if (preferredProvider === "brevo") {
    if (process.env.BREVO_API_KEY) {
      const res = await sendWithBrevo(options);
      if (res.success) return res;
      console.warn("[Email Fallback] Brevo failed, trying Resend...", res.error);
    }
    if (process.env.RESEND_API_KEY) {
      return await sendWithResend(options);
    }
  }

  // If no email API keys are supplied (e.g. local developer machine without external keys), simulate dispatch gracefully
  console.log(`[Email Simulated (${preferredProvider})] To: ${options.to} | Subject: ${options.subject}`);
  return {
    success: true,
    provider: "simulated",
    messageId: `sim_${Date.now()}`,
  };
}

/**
 * Sends order confirmation and receipt to the customer
 */
export async function sendCustomerOrderReceipt(data: OrderEmailData): Promise<EmailResult> {
  const subject = `Order Confirmation #${data.reference} - Deval Marketplace`;
  const html = generateCustomerReceiptHtml(data);
  return await sendEmail({
    to: data.customerEmail,
    subject,
    html,
  });
}

/**
 * Sends alert to a vendor when products from their store are purchased
 */
export async function sendVendorOrderAlert(
  data: OrderEmailData,
  vendorEmail: string,
  vendorName: string,
  vendorItems: OrderItemEmailData[]
): Promise<EmailResult> {
  const subject = `[New Order] #${data.reference} - Action Required for ${vendorName}`;
  const html = generateVendorAlertHtml(data, vendorName, vendorItems);
  return await sendEmail({
    to: vendorEmail,
    subject,
    html,
  });
}

/**
 * Sends transaction alert to platform administrator
 */
export async function sendAdminOrderAlert(data: OrderEmailData): Promise<EmailResult> {
  const adminEmail = process.env.ADMIN_ALERT_EMAIL || process.env.RESEND_FROM_EMAIL || "admin@devalshopping.com";
  const subject = `[Admin Alert] Order #${data.reference} Completed - ${data.currency || "KES"} ${data.totalAmount}`;
  const html = generateAdminAlertHtml(data);
  return await sendEmail({
    to: adminEmail,
    subject,
    html,
  });
}

/**
 * Sends order status update to customer (Dispatched, Ready for Pickup, Delivered, etc.)
 */
export async function sendOrderStatusUpdate(
  reference: string,
  customerEmail: string,
  customerName: string,
  newStatus: string,
  fulfillmentType: string,
  pickupCode?: string,
  pickupStationName?: string
): Promise<EmailResult> {
  const subject = `Order #${reference} Update: ${newStatus}`;
  const html = generateStatusUpdateHtml(
    reference,
    customerName,
    newStatus,
    fulfillmentType,
    pickupCode,
    pickupStationName
  );
  return await sendEmail({
    to: customerEmail,
    subject,
    html,
  });
}
