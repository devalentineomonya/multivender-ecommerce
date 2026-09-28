import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getServerTranslator } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();
  return {
    title: t("meta.privacy.title"),
    description: t("meta.privacy.description"),
  };
}

// The legal body text below is intentionally left in English rather than machine-translated:
// an imprecise translation of data-protection disclosures carries real legal risk.
export default async function PrivacyPage() {
  const { t } = await getServerTranslator();
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-gray-200 pb-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t("privacy.heading")}
        </h1>
        <p className="text-sm text-gray-500 mt-2">{t("terms.effectiveDate")}</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">1. Information We Collect</h2>
          <p>
            When you register an account, place an order, or create a vendor storefront on ShoppingCart, we collect information including your name, email address, phone number, delivery address, and order transaction history.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Process and fulfill orders placed with marketplace vendors.</li>
            <li>Send order confirmation receipts, pickup PIN notifications, and delivery updates via email (Resend/Brevo).</li>
            <li>Detect, prevent, and mitigate fraudulent transactions and abuse.</li>
            <li>Personalize your marketplace browsing and product recommendations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">3. Payment Security & Data Sharing</h2>
          <p>
            Payment information (credit/debit cards, bank details, and mobile money numbers) is collected directly by our payment processor Paystack via secure HTTPS tokens. ShoppingCart never stores your full card credentials or banking passwords on its servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">4. Vendor Information Sharing</h2>
          <p>
            When you order items from a vendor, that vendor receives the required shipping and fulfillment details (customer name, delivery address or pickup hub, and phone number) to ensure prompt delivery. Vendors are bound by confidentiality obligations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">5. Your Rights & Contact</h2>
          <p>
            You have the right to access, update, or request deletion of your personal data at any time through your User Dashboard or by contacting customer support.
          </p>
        </section>

        <section className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-primary hover:underline"
          >
            ← Back to ShoppingCart Home
          </Link>
          <Link
            href="/terms"
            className="text-xs font-bold text-primary hover:underline"
          >
            Read Terms of Service →
          </Link>
        </section>
      </div>
    </main>
  );
}
