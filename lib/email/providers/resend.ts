import { SendEmailOptions, EmailResult } from "../types";

export async function sendWithResend(options: SendEmailOptions): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      provider: "resend",
      error: "RESEND_API_KEY environment variable is not configured",
    };
  }

  const fromEmail =
    options.from ||
    process.env.RESEND_FROM_EMAIL ||
    "Marketplace Orders <onboarding@resend.dev>";

  try {
    const toRecipients = Array.isArray(options.to) ? options.to : [options.to];

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toRecipients,
        subject: options.subject,
        html: options.html,
        text: options.text || options.subject,
        reply_to: options.replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Resend Error]", data);
      return {
        success: false,
        provider: "resend",
        error: data.message || "Failed to send email via Resend",
      };
    }

    return {
      success: true,
      messageId: data.id,
      provider: "resend",
    };
  } catch (error: any) {
    console.error("[Resend Exception]", error);
    return {
      success: false,
      provider: "resend",
      error: error.message || "Network exception sending email via Resend",
    };
  }
}
