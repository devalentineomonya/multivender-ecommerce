import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ShoppingCart",
  description: "Terms and conditions for using the ShoppingCart multivendor marketplace.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-gray-200 pb-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Effective date: September 2026 • Powered by ShoppingCart
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">1. Agreement to Terms</h2>
          <p>
            By accessing or using ShoppingCart, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">2. Marketplace Platform & Vendors</h2>
          <p>
            ShoppingCart functions as a multivendor marketplace connecting independent verified merchants (&quot;Vendors&quot;) with buyers. While ShoppingCart facilitates transactions, order routing, and payments, the contract for sale is directly between the buyer and the vendor.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">3. Payments & Escrow via Paystack</h2>
          <p>
            All monetary transactions are processed securely through Paystack. By submitting order payments via cards, mobile money (M-Pesa), bank transfer, or USSD, you authorize ShoppingCart and Paystack to collect payment. Funds are held and disbursed to verified vendors upon successful delivery or collection verification.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">4. Pickup Stations & Verification PINs</h2>
          <p>
            For orders designated for Pickup Station collection, customers receive a unique Verification PIN. The PIN must be presented at the pickup counter. The pickup agent verifies the PIN before release. Once marked as collected with the valid PIN, the order is deemed fulfilled.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-2">5. Returns & Buyer Protection</h2>
          <p>
            Items may be returned within 7 days of delivery or collection if defective, counterfeit, or substantially different from the product description. Returned goods must include original tags and packaging.
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
            href="/privacy"
            className="text-xs font-bold text-primary hover:underline"
          >
            Read Privacy Policy →
          </Link>
        </section>
      </div>
    </main>
  );
}
