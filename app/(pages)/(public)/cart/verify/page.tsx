import React from "react";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { orderTable } from "@/db/models/order";
import { BiCheckCircle, BiStore, BiCopy, BiShoppingBag } from "react-icons/bi";
import { BsTruck } from "react-icons/bs";
import { getServerTranslator } from "@/lib/i18n/server";

interface VerifyPageProps {
  searchParams: Promise<{ reference?: string }>;
}

export default async function CartVerifyPage({ searchParams }: VerifyPageProps) {
  const { reference } = await searchParams;
  const { t, formatPrice } = await getServerTranslator();

  if (!reference) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800">{t("verify.noReference.title")}</h1>
        <p className="text-sm text-gray-500 mt-2 mb-6">{t("verify.noReference.body")}</p>
        <Link href="/" className="inline-block bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold">
          {t("verify.noReference.cta")}
        </Link>
      </main>
    );
  }

  // Look up order in database
  const [order] = await db
    .select()
    .from(orderTable)
    .where(eq(orderTable.paystackReference, reference))
    .limit(1);

  const isPickup = order?.fulfillmentType === "pickup";
  const pickupStation = order?.pickupStation as any;
  const items = Array.isArray(order?.items) ? order.items : [];

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-in zoom-in-75">
          <BiCheckCircle />
        </div>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {t("verify.confirmed")}
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">{t("verify.thankYou")}</h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto mt-2">
          {t("verify.paymentProcessed", { provider: "Paystack" })}
        </p>

        {/* Reference & Status */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 my-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-gray-500">{t("verify.orderReference")}</span>
            <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">{reference}</div>
          </div>
          <div>
            <span className="text-gray-500">{t("verify.paymentStatus")}</span>
            <div className="font-bold text-emerald-600 capitalize mt-0.5">
              {order?.paymentStatus || t("verify.statusPaid")}
            </div>
          </div>
          <div>
            <span className="text-gray-500">{t("verify.totalAmount")}</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
              {order?.totalAmount ? formatPrice(Number(order.totalAmount)) : ""}
            </div>
          </div>
        </div>

        {/* Fulfillment Specific Card */}
        {isPickup ? (
          <div className="bg-blue-50/70 border-2 border-dashed border-blue-400 rounded-2xl p-6 my-6 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              <BiStore className="text-lg" />
              <span>{t("verify.pickup.pinHeading")}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-blue-900 tracking-widest my-2">
              {order?.pickupCode || "PK-CONFIRMED"}
            </div>
            <p className="text-xs text-blue-700 max-w-sm mx-auto">{t("verify.pickup.instructions")}</p>

            {pickupStation && (
              <div className="mt-5 pt-4 border-t border-blue-200 text-left text-xs text-slate-800 space-y-1 bg-white/70 p-4 rounded-xl">
                <div><strong>{t("verify.pickup.station")}</strong> {pickupStation.name}</div>
                <div><strong>{t("verify.pickup.address")}</strong> {pickupStation.address}, {pickupStation.city}</div>
                <div><strong>{t("verify.pickup.hours")}</strong> {pickupStation.operatingHours}</div>
                <div><strong>{t("verify.pickup.contact")}</strong> {pickupStation.phoneNumber}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 my-6 text-left text-xs text-slate-800">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm mb-2">
              <BsTruck className="text-lg" />
              <span>{t("verify.delivery.heading")}</span>
            </div>
            <p className="text-gray-600 mb-3">{t("verify.delivery.body")}</p>
            <div className="text-gray-700 space-y-1">
              <div><strong>{t("verify.delivery.recipient")}</strong> {order?.customerEmail}</div>
              <div><strong>{t("verify.delivery.status")}</strong> {order?.status || t("verify.delivery.statusProcessing")}</div>
            </div>
          </div>
        )}

        {/* Purchased Items List */}
        {items.length > 0 && (
          <div className="text-left my-6 border border-gray-100 rounded-xl p-4 bg-white">
            <h3 className="font-bold text-sm text-slate-900 mb-3">
              {t("verify.items.heading", { count: items.length })}
            </h3>
            <div className="divide-y divide-gray-100">
              {items.map((item: any, i: number) => (
                <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    {item.storeName && (
                      <div className="text-[11px] text-primary">
                        {t("verify.items.merchant", { name: item.storeName })}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            href="/user/dashboard"
            className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 rounded-full text-xs font-bold transition-colors"
          >
            {t("verify.actions.dashboard")}
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-primary text-white hover:opacity-90 px-6 py-3 rounded-full text-xs font-bold transition-opacity"
          >
            {t("verify.actions.continueShopping")}
          </Link>
        </div>
      </div>
    </main>
  );
}
