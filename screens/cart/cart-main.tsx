"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BiShoppingBag, BiArrowBack, BiStore } from "react-icons/bi";
import { BsTruck } from "react-icons/bs";
import { useCartStore } from "@/lib/zustand/cart-store";
import { createClient } from "@/lib/supabase/client";
import CartItemCard from "./cart-item-card";
import CartPayment from "./cart-payment";
import CartDeliveryInfoForm, { type DeliveryFormValues } from "./cart-delivery-info-form";
import CartPickupSelector from "./cart-pickup-selector";
import { DEFAULT_PICKUP_STATIONS, type PickupStationOption } from "@/db/models/pickup-stations";
import { useI18nStore } from "@/lib/i18n/store";

const CartMain = () => {
  const { t, tp } = useI18nStore();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">("delivery");

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryFormValues>({
    firstName: "",
    lastName: "",
    address: "",
    town: "",
    zip: "",
    email: "",
    number: "",
    notes: "",
  });

  const [pickupStation, setPickupStation] = useState<PickupStationOption | null>(
    DEFAULT_PICKUP_STATIONS[0] || null
  );

  useEffect(() => {
    setMounted(true);
    // Autofill user information if logged in
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setDeliveryInfo((prev) => ({
          ...prev,
          email: user.email || prev.email,
          firstName: user.user_metadata?.firstName || prev.firstName,
          lastName: user.user_metadata?.lastName || prev.lastName,
          number: user.user_metadata?.phone || prev.number,
        }));
      }
    });
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-4xl mb-4">
          <BiShoppingBag />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{t("cart.empty.title")}</h2>
        <p className="text-sm text-gray-500 max-w-md mb-6">{t("cart.empty.body")}</p>
        <Link
          href="/shop"
          className="bg-primary text-white hover:bg-slate-900 transition-colors py-3 px-8 rounded-full text-sm font-semibold flex items-center gap-2"
        >
          <BiArrowBack />
          <span>{t("cart.empty.cta")}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-15rem)] py-6">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left Section: Items and Delivery / Pickup Options */}
        <div className="w-full md:w-3/5">
          {/* Items Container */}
          <div className="card-surface p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl">
                {tp("cart.itemsHeading", items.reduce((acc, i) => acc + i.quantity, 0))}
              </h2>
              <Link href="/shop" className="text-xs text-primary font-semibold hover:underline">
                {t("cart.continueShopping")}
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Fulfillment Method Switcher */}
          <div className="mt-8">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              {t("cart.chooseFulfillment")}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType("delivery")}
                className={`p-4 rounded-xl border-2 font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer ${
                  fulfillmentType === "delivery"
                    ? "border-primary bg-primary/5 text-primary shadow-xs"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                }`}
              >
                <BsTruck className="text-xl" />
                <span>{t("cart.homeDelivery")}</span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType("pickup")}
                className={`p-4 rounded-xl border-2 font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer ${
                  fulfillmentType === "pickup"
                    ? "border-primary bg-primary/5 text-primary shadow-xs"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                }`}
              >
                <BiStore className="text-xl" />
                <span>{t("cart.pickupStationLabel")}</span>
              </button>
            </div>

            {/* Render selected fulfillment form */}
            {fulfillmentType === "delivery" ? (
              <CartDeliveryInfoForm
                values={deliveryInfo}
                onChange={setDeliveryInfo}
              />
            ) : (
              <CartPickupSelector
                selectedStation={pickupStation}
                onSelectStation={setPickupStation}
              />
            )}
          </div>
        </div>

        {/* Right Section: Order Summary & Paystack Checkout */}
        <CartPayment
          fulfillmentType={fulfillmentType}
          deliveryInfo={deliveryInfo}
          pickupStation={pickupStation}
        />
      </div>
    </div>
  );
};

export default CartMain;
