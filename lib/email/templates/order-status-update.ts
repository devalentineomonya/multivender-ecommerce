export function generateStatusUpdateHtml(
  reference: string,
  customerName: string,
  newStatus: string,
  fulfillmentType: string,
  pickupCode?: string,
  pickupStationName?: string
): string {
  let statusBadgeColor = "#3b82f6";
  let statusDescription = "Your order status has been updated.";

  switch (newStatus.toLowerCase()) {
    case "processing":
      statusBadgeColor = "#f59e0b";
      statusDescription = "Your order is currently being packed by our sellers.";
      break;
    case "ready for pickup":
    case "ready_for_pickup":
      statusBadgeColor = "#10b981";
      statusDescription = `Your order is ready for pickup at <strong>${pickupStationName || "your selected pickup station"}</strong>! Present code <strong>${pickupCode || ""}</strong> to collect.`;
      break;
    case "dispatched":
    case "out for delivery":
    case "out_for_delivery":
      statusBadgeColor = "#6366f1";
      statusDescription = "Your order has been handed to our express courier for delivery to your address.";
      break;
    case "delivered":
    case "collected":
      statusBadgeColor = "#10b981";
      statusDescription = "Your package has been successfully delivered / collected. Thank you for shopping with us!";
      break;
    case "cancelled":
      statusBadgeColor = "#ef4444";
      statusDescription = "Your order has been cancelled. If payment was made, your refund is being processed.";
      break;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Status Update #${reference}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #000000; padding: 20px 30px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff; font-size: 20px;">Order Status Update</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 15px; color: #334155; margin-top: 0;">
                Hello <strong>${customerName}</strong>,
              </p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                The status of your order <strong style="font-family: monospace;">#${reference}</strong> has changed:
              </p>

              <div style="text-align: center; margin: 24px 0;">
                <span style="display: inline-block; background-color: ${statusBadgeColor}; color: #ffffff; font-size: 16px; font-weight: 700; padding: 8px 24px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">
                  ${newStatus}
                </span>
              </div>

              <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; font-size: 14px; color: #1e293b; line-height: 1.6;">
                ${statusDescription}
              </div>

              ${
                pickupCode && (newStatus.toLowerCase() === "ready for pickup" || newStatus.toLowerCase() === "ready_for_pickup")
                  ? `
                <div style="margin-top: 20px; padding: 16px; background-color: #eff6ff; border: 2px dashed #3b82f6; border-radius: 8px; text-align: center;">
                  <span style="font-size: 12px; color: #1e40af; font-weight: bold; text-transform: uppercase;">Pickup Verification Code:</span>
                  <div style="font-size: 28px; font-weight: 900; color: #1e3a8a; letter-spacing: 3px; font-family: monospace; margin-top: 4px;">
                    ${pickupCode}
                  </div>
                </div>`
                  : ""
              }

              <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/user/dashboard"
                   style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">
                  Track in Customer Dashboard &rarr;
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
