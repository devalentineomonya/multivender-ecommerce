import { OrderEmailData } from "../types";

export function generateAdminAlertHtml(data: OrderEmailData): string {
  const currency = data.currency || "KES";
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Admin Order Alert #${data.reference}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #7c3aed; padding: 20px 30px; text-align: left;">
              <span style="color: #ede9fe; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Platform Superuser Notification</span>
              <h2 style="margin: 4px 0 0 0; color: #ffffff; font-size: 20px;">New Marketplace Transaction</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 30px;">
              <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px; color: #334155; margin-bottom: 20px;">
                <tr>
                  <td width="35%" style="color: #64748b;">Order Reference:</td>
                  <td style="font-weight: 700; font-family: monospace;">${data.reference}</td>
                </tr>
                <tr>
                  <td style="color: #64748b;">Total Amount:</td>
                  <td style="font-weight: 800; color: #7c3aed; font-size: 16px;">${currency} ${Number(data.totalAmount).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="color: #64748b;">Customer:</td>
                  <td>${data.customerName} (${data.customerEmail})</td>
                </tr>
                <tr>
                  <td style="color: #64748b;">Fulfillment Method:</td>
                  <td><span style="background-color: #f1f5f9; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; font-size: 11px; font-weight: 600;">${data.fulfillmentType}</span></td>
                </tr>
                <tr>
                  <td style="color: #64748b;">Total Items:</td>
                  <td>${data.items.reduce((acc, i) => acc + i.quantity, 0)} units across ${data.items.length} product(s)</td>
                </tr>
              </table>

              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/dashboard"
                   style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
                  View Order in Admin Control Center &rarr;
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
