import { OrderEmailData, OrderItemEmailData } from "../types";

export function generateVendorAlertHtml(
  data: OrderEmailData,
  vendorName: string,
  vendorItems: OrderItemEmailData[]
): string {
  const currency = data.currency || "KES";
  const vendorTotal = vendorItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemsHtml = vendorItems
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 8px;">
          <div style="font-weight: 600; color: #1e293b; font-size: 14px;">${item.name}</div>
          ${item.size ? `<span style="font-size: 12px; color: #64748b;">Size: ${item.size}</span> ` : ""}
          ${item.color ? `<span style="font-size: 12px; color: #64748b;">Color: ${item.color}</span>` : ""}
        </td>
        <td style="padding: 10px 8px; text-align: center; color: #475569; font-size: 14px;">${item.quantity}</td>
        <td style="padding: 10px 8px; text-align: right; font-weight: 600; color: #0f172a; font-size: 14px;">
          ${currency} ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`
    )
    .join("");

  const fulfillmentInstructions =
    data.fulfillmentType === "pickup"
      ? `
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
        <strong style="color: #1e40af; font-size: 14px;">🏪 Station / Store Pickup Order</strong>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #1e293b;">
          Please pack and label this order with reference <strong>${data.reference}</strong>. Dispatch it to <strong>${data.pickupStation?.name || "Pickup Hub"}</strong> for customer collection.
        </p>
      </div>`
      : `
      <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
        <strong style="color: #065f46; font-size: 14px;">🚚 Direct Delivery Order</strong>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #1e293b;">
          Prepare package for courier pickup. Shipping to: <strong>${data.deliveryAddress?.city || "Destination City"}</strong> (${data.deliveryAddress?.street || ""}).
        </p>
      </div>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order Alert #${data.reference}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #0f172a; padding: 20px 30px; text-align: left;">
              <span style="color: #10b981; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Merchant Notification</span>
              <h2 style="margin: 4px 0 0 0; color: #ffffff; font-size: 20px;">New Order for ${vendorName}</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 30px;">
              <p style="font-size: 14px; color: #334155; margin-top: 0;">
                You received a new paid order via <strong>Paystack</strong>! Please prepare the items below for prompt fulfillment.
              </p>

              <div style="font-size: 13px; color: #64748b; background-color: #f1f5f9; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px;">
                <strong>Order Reference:</strong> <span style="font-family: monospace; color: #0f172a;">${data.reference}</span> &nbsp;|&nbsp;
                <strong>Customer:</strong> ${data.customerName} (${data.customerPhone || data.customerEmail})
              </div>

              ${fulfillmentInstructions}

              <h4 style="margin: 20px 0 8px 0; color: #0f172a; font-size: 14px; text-transform: uppercase;">Items to Fulfill:</h4>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #e2e8f0; text-align: left; font-size: 12px; color: #64748b;">
                    <th style="padding: 6px 8px;">Product</th>
                    <th style="padding: 6px 8px; text-align: center;">Qty</th>
                    <th style="padding: 6px 8px; text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr style="border-top: 2px solid #e2e8f0;">
                    <td colspan="2" style="padding: 10px 8px; font-weight: 700; color: #0f172a;">Store Payout Subtotal:</td>
                    <td style="padding: 10px 8px; text-align: right; font-weight: 800; color: #10b981; font-size: 15px;">
                      ${currency} ${vendorTotal.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style="margin-top: 24px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/vendor/dashboard"
                   style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
                  Open Vendor Portal &rarr;
                </a>
              </div>
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
