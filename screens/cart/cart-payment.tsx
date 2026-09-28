"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";
import { BiLock, BiCreditCard, BiCheckCircle } from "react-icons/bi";
import { toast } from "react-toastify";
import { useCartStore } from "@/lib/zustand/cart-store";
import { useI18nStore } from "@/lib/i18n/store";
import { DEFAULT_CURRENCY } from "@/lib/i18n/config";
import type { DeliveryFormValues } from "./cart-delivery-info-form";
import type { PickupStationOption } from "@/db/models/pickup-stations";
import footerPaymentMethod from "@/components/common/footer/footerpaymentmethods";

interface CartPaymentProps {
  fulfillmentType: "delivery" | "pickup";
  deliveryInfo: DeliveryFormValues;
  pickupStation: PickupStationOption | null;
}

const CartPayment: React.FC<CartPaymentProps> = ({
  fulfillmentType,
  deliveryInfo,
  pickupStation,
}) => {
  const router = useRouter();
  const { formatPrice, formatNumber, t, tp } = useI18nStore();
  // Prices are stored in KES; the selected currency only affects display, so always charge in KES.
  const chargeCurrency = DEFAULT_CURRENCY;
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "cash">("paystack");
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  // Delivery fee: 5 (in base price unit) if delivery, 0 if pickup
  const shippingFee = fulfillmentType === "delivery" ? 5 : 0;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === "SAVE10" || couponCode.toUpperCase() === "WELCOME10") {
      setDiscountPercent(10);
      toast.success(t("cart.coupon.applied", { percent: 10 }));
    } else if (couponCode.toUpperCase() === "DEVAL20") {
      setDiscountPercent(20);
      toast.success(t("cart.coupon.applied", { percent: 20 }));
    } else {
      toast.error(t("cart.coupon.invalid"));
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error(t("cart.toast.emptyCart"));
      return;
    }

    // Validate fulfillment inputs
    if (fulfillmentType === "delivery") {
      if (!deliveryInfo.firstName || !deliveryInfo.address || !deliveryInfo.town || !deliveryInfo.email || !deliveryInfo.number) {
        toast.error(t("cart.toast.missingDeliveryFields"));
        return;
      }
    } else {
      if (!pickupStation) {
        toast.error(t("cart.toast.missingPickupStation"));
        return;
      }
      if (!deliveryInfo.email) {
        toast.error(t("cart.toast.missingPickupEmail"));
        return;
      }
    }

    setLoading(true);
    const toastId = toast.loading(t("cart.toast.initializing"));

    try {
      // 1. Initialize order & Paystack transaction on server
      const response = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
            image: i.image,
            vendorId: i.vendorId,
            storeName: i.storeName,
          })),
          totalAmount,
          shippingFee,
          discountAmount,
          currency: chargeCurrency,
          customerEmail: deliveryInfo.email,
          customerName: `${deliveryInfo.firstName} ${deliveryInfo.lastName}`.trim() || "Customer",
          customerPhone: deliveryInfo.number,
          fulfillmentType,
          deliveryAddress:
            fulfillmentType === "delivery"
              ? {
                  street: deliveryInfo.address,
                  city: deliveryInfo.town,
                  state: deliveryInfo.town,
                  postalCode: deliveryInfo.zip,
                }
              : undefined,
          pickupStation:
            fulfillmentType === "pickup" && pickupStation
              ? {
                  id: pickupStation.id,
                  name: pickupStation.name,
                  address: pickupStation.address,
                  city: pickupStation.city,
                  state: pickupStation.state,
                  phoneNumber: pickupStation.phoneNumber,
                  operatingHours: pickupStation.operatingHours,
                  fee: pickupStation.fee,
                }
              : undefined,
          customerNotes: deliveryInfo.notes,
        }),
      });

      const initData = await response.json();

      if (!response.ok || !initData.success) {
        throw new Error(initData.message || t("cart.toast.initFailed"));
      }

      toast.update(toastId, {
        render: t("cart.toast.openingCheckout"),
        type: "info",
        isLoading: true,
      });

      const { reference, accessCode, publicKey } = initData;

      // 2. Launch Paystack Inline Modal via @paystack/inline-js
      const { default: PaystackPop } = await import("@paystack/inline-js");
      const paystack = new PaystackPop();

      const verifyAndFinalize = async (txReference: string) => {
        const verifyToastId = toast.loading(t("cart.toast.verifying"));
        try {
          const verifyRes = await fetch("/api/payments/paystack/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: txReference }),
          });
          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            clearCart();
            toast.dismiss(verifyToastId);
            toast.success(t("cart.toast.paymentSuccess"));
            router.push(`/cart/verify?reference=${encodeURIComponent(txReference)}`);
          } else {
            toast.update(verifyToastId, {
              render: verifyData.message || t("cart.toast.verificationIncomplete"),
              type: "warning",
              isLoading: false,
              autoClose: 5000,
            });
            router.push(`/cart/verify?reference=${encodeURIComponent(txReference)}`);
          }
        } catch (vErr: any) {
          toast.dismiss(verifyToastId);
          router.push(`/cart/verify?reference=${encodeURIComponent(txReference)}`);
        }
      };

      if (accessCode && accessCode !== "mock_code_" + reference) {
        // Resume with access code created on the server
        paystack.resumeTransaction(accessCode, {
          onSuccess: (transaction: any) => {
            toast.dismiss(toastId);
            verifyAndFinalize(transaction.reference || reference);
          },
          onCancel: () => {
            toast.dismiss(toastId);
            toast.info(t("cart.toast.transactionCancelled"));
            setLoading(false);
          },
          onError: (error: any) => {
            toast.dismiss(toastId);
            toast.error(error.message || t("cart.toast.paymentError"));
            setLoading(false);
          },
        });
      } else {
        // Use newTransaction with key
        paystack.newTransaction({
          key: publicKey,
          email: deliveryInfo.email,
          amount: Math.round(totalAmount * 100),
          currency: chargeCurrency,
          reference,
          metadata: {
            fulfillmentType,
            custom_fields: [
              {
                display_name: "Fulfillment",
                variable_name: "fulfillment",
                value: fulfillmentType === "pickup" ? "Pickup Station" : "Home Delivery",
              },
            ],
          },
          onSuccess: (transaction: any) => {
            toast.dismiss(toastId);
            verifyAndFinalize(transaction.reference || reference);
          },
          onCancel: () => {
            toast.dismiss(toastId);
            toast.info(t("cart.toast.transactionCancelled"));
            setLoading(false);
          },
          onError: (error: any) => {
            toast.dismiss(toastId);
            toast.error(error.message || t("cart.toast.paymentError"));
            setLoading(false);
          },
        });
      }
    } catch (err: any) {
      console.error("[Checkout Exception]", err);
      toast.dismiss(toastId);
      toast.error(err.message || t("cart.toast.unexpectedError"));
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-2/5 border border-gray-200 rounded-2xl p-6 bg-white shadow-xs h-fit sticky top-20">
      <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-3">
        {t("cart.summary.heading")}
      </h2>

      {/* Coupon Form */}
      <form onSubmit={handleApplyCoupon} className="flex relative py-1 rounded-full w-full bg-gray-100 my-4 px-4 items-center">
        <input
          autoComplete="off"
          name="coupon"
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder={t("cart.coupon.placeholder")}
          className="outline-none border-none bg-transparent w-2/3 uppercase text-xs font-semibold placeholder:font-normal placeholder:capitalize"
        />
        <button
          type="submit"
          className="ml-auto py-1.5 rounded-full bg-slate-900 text-white px-3.5 text-xs font-semibold hover:bg-primary transition-colors cursor-pointer"
        >
          {t("cart.coupon.apply")}
        </button>
      </form>

      {/* Payment Method Selector */}
      <h4 className="text-sm font-bold text-slate-800 mb-3 border-t border-gray-100 pt-3">
        {t("cart.gateway.heading")}
      </h4>

      <div className="space-y-2 mb-4">
        <label
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            paymentMethod === "paystack"
              ? "border-primary bg-primary/5 ring-1 ring-primary/30"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="paystack"
            checked={paymentMethod === "paystack"}
            onChange={() => setPaymentMethod("paystack")}
            className="text-primary focus:ring-primary h-4 w-4"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">
                {t("cart.gateway.paystackName")}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {t("cart.gateway.instant")}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {t("cart.gateway.paystackMethods")}
            </p>
          </div>
        </label>
      </div>

      <div className="flex items-center gap-2 mb-4 opacity-75">
        {footerPaymentMethod.slice(0, 4).map((method) => (
          <Image
            src={method.image}
            alt={method.name ?? "card"}
            key={method.name}
            height={20}
            className="object-contain"
          />
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
        <div className="flex justify-between text-gray-600">
          <span>{tp("cart.summary.subtotalCount", items.reduce((acc, i) => acc + i.quantity, 0))}</span>
          <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>
            {fulfillmentType === "delivery" ? t("cart.summary.homeShipping") : t("cart.summary.pickupFee")}
          </span>
          <span className={`font-semibold ${shippingFee === 0 ? "text-emerald-600" : "text-slate-800"}`}>
            {shippingFee === 0 ? t("cart.summary.free") : formatPrice(shippingFee)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>{t("cart.summary.couponDiscount", { percent: discountPercent })}</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline text-base font-extrabold text-slate-900">
          <span>{t("cart.summary.total")}</span>
          <span className="text-xl text-primary font-black">{formatPrice(totalAmount)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        type="button"
        disabled={loading || items.length === 0}
        onClick={handleCheckout}
        className="w-full py-3.5 px-4 mt-5 rounded-full bg-primary hover:bg-slate-900 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <BiLock className="text-base" />
        {loading ? t("cart.checkout.processing") : t("cart.checkout.payWith", { amount: formatPrice(totalAmount) })}
      </button>

      <div className="mt-3 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
        <BiCheckCircle className="text-emerald-500" />
        <span>{t("cart.checkout.secureNote")}</span>
      </div>
    </div>
  );
};

export default CartPayment;
