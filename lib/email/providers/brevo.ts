import { SendEmailOptions, EmailResult } from "../types";

export async function sendWithBrevo(options: SendEmailOptions): Promise<EmailResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      provider: "brevo",
      error: "BREVO_API_KEY environment variable is not configured",
    };
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "orders@devalshopping.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Deval Marketplace";

  try {
    const toRecipients = (Array.isArray(options.to) ? options.to : [options.to]).map(
      (email) => ({ email })
    );

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: toRecipients,
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text || options.subject,
        replyTo: options.replyTo ? { email: options.replyTo } : undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Brevo Error]", data);
      return {
        success: false,
        provider: "brevo",
        error: data.message || "Failed to send email via Brevo",
      };
    }

    return {
      success: true,
      messageId: data.messageId,
      provider: "brevo",
    };
  } catch (error: any) {
    console.error("[Brevo Exception]", error);
    return {
      success: false,
      provider: "brevo",
      error: error.message || "Network exception sending email via Brevo",
    };
  }
}
