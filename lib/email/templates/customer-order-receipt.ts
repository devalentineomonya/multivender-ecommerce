import { OrderEmailData } from "../types";

export function generateCustomerReceiptHtml(data: OrderEmailData): string {
  const currency = data.currency || "KES";
  const formattedTotal = `${currency} ${Number(data.totalAmount).toLocaleString()}`;
  const formattedSubtotal = `${currency} ${Number(data.subtotalAmount || data.totalAmount - (data.shippingFee || 0)).toLocaleString()}`;
  const formattedShipping = data.shippingFee && data.shippingFee > 0
    ? `${currency} ${Number(data.shippingFee).toLocaleString()}`
    : "FREE";

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 8px; vertical-align: middle;">
          <div style="font-weight: 600; color: #1e293b; font-size: 14px;">${item.name}</div>
          ${item.size ? `<span style="font-size: 12px; color: #64748b;">Size: ${item.size}</span> ` : ""}
          ${item.color ? `<span style="font-size: 12px; color: #64748b;">Color: ${item.color}</span>` : ""}
          ${item.storeName ? `<div style="font-size: 11px; color: #0284c7; margin-top: 2px;">Sold by: ${item.storeName}</div>` : ""}
        </td>
        <td style="padding: 12px 8px; text-align: center; color: #475569; font-size: 14px;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #0f172a; font-size: 14px;">
          ${currency} ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`
    )
    .join("");

  const fulfillmentSection =
    data.fulfillmentType === "pickup"
      ? `
      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #1e40af; letter-spacing: 1px;">
          🏪 Self-Pickup Verification Code
        </div>
        <div style="font-size: 32px; font-weight: 900; color: #1e3a8a; letter-spacing: 4px; margin: 10px 0; font-family: monospace;">
          ${data.pickupCode || "PK-CONFIRMED"}
        </div>
        <p style="margin: 0; font-size: 13px; color: #3b82f6;">Present this code and your ID when collecting your package.</p>
        <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #bfdbfe; text-align: left; font-size: 13px; color: #1e293b;">
          <strong>Pickup Station:</strong> ${data.pickupStation?.name || "Designated Pickup Center"}<br/>
          <strong>Location:</strong> ${data.pickupStation?.address || ""}, ${data.pickupStation?.city || ""}<br/>
          <strong>Hours:</strong> ${data.pickupStation?.operatingHours || "Mon-Sat 8:00 AM - 6:00 PM"}<br/>
          <strong>Station Phone:</strong> ${data.pickupStation?.phoneNumber || "+254 700 000 000"}
        </div>
      </div>`
      : `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 24px 0;">
        <div style="font-weight: 700; color: #0f172a; font-size: 14px; margin-bottom: 8px;">
          🚚 Home Delivery Details
        </div>
        <div style="font-size: 13px; color: #334155; line-height: 1.6;">
          <strong>Recipient:</strong> ${data.customerName}<br/>
          <strong>Phone:</strong> ${data.customerPhone || "Provided on account"}<br/>
          <strong>Address:</strong> ${data.deliveryAddress?.street || ""}, ${data.deliveryAddress?.city || ""}, ${data.deliveryAddress?.state || ""}<br/>
          <strong>Status:</strong> Dispatched soon via our express courier
        </div>
      </div>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation #${data.reference}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 24px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">DEVAL MARKETPLACE</h1>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">Thank you for your purchase!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px;">
              <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
                Hello ${data.customerName || "Valued Customer"},
              </div>
              <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-top: 0;">
                Your payment was received successfully via <strong>Paystack</strong>. We are now preparing your order.
              </p>

              <div style="background-color: #f8fafc; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #64748b;">
                <strong>Order Reference:</strong> <span style="font-family: monospace; color: #0f172a;">${data.reference}</span> &nbsp;|&nbsp;
                <strong>Date:</strong> ${new Date(data.createdAt || Date.now()).toLocaleDateString()}
              </div>

              ${fulfillmentSection}

              <!-- Items Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #e2e8f0; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b;">
                    <th style="padding: 8px 8px;">Item</th>
                    <th style="padding: 8px 8px; text-align: center;">Qty</th>
                    <th style="padding: 8px 8px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <div style="margin-top: 20px; border-top: 2px solid #e2e8f0; padding-top: 16px;">
                <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 14px;">
                  <tr>
                    <td style="color: #64748b;">Subtotal</td>
                    <td style="text-align: right; color: #1e293b; font-weight: 600;">${formattedSubtotal}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b;">Shipping / Handling</td>
                    <td style="text-align: right; color: #1e293b; font-weight: 600;">${formattedShipping}</td>
                  </tr>
                  ${data.discountAmount && data.discountAmount > 0 ? `
                  <tr>
                    <td style="color: #16a34a;">Discount</td>
                    <td style="text-align: right; color: #16a34a; font-weight: 600;">-${currency} ${data.discountAmount}</td>
                  </tr>` : ""}
                  <tr style="border-top: 1px solid #cbd5e1; font-size: 16px;">
                    <td style="font-weight: 700; color: #0f172a; padding-top: 8px;">Total Paid</td>
                    <td style="text-align: right; font-weight: 800; color: #0284c7; padding-top: 8px;">${formattedTotal}</td>
                  </tr>
                </table>
              </div>

              <!-- Support Note -->
              <div style="margin-top: 30px; padding: 16px; background-color: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b; text-align: center;">
                Need help with your order? Reach our support team anytime at <a href="mailto:support@devalshopping.com" style="color: #0284c7; text-decoration: none;">support@devalshopping.com</a> or call <a href="tel:+254768133220" style="color: #0284c7; text-decoration: none;">+254 768 133 220</a>.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
              &copy; ${new Date().getFullYear()} Deval Multivendor Marketplace. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
