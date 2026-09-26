"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next-nprogress-bar";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  BiUser,
  BiShoppingBag,
  BiMap,
  BiLogOut,
  BiStore,
  BiCheckCircle,
  BiCopy,
} from "react-icons/bi";
import { toast } from "react-toastify";

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push("/auth/sign-in");
        return;
      }

      setUser(currentUser);

      try {
        const res = await fetch("/api/orders/my-orders");
        const json = await res.json();
        if (json.success) {
          setOrders(json.data || []);
        }
      } catch (err) {
        console.error("Failed loading customer orders:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied PIN: ${code}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const role = user?.app_metadata?.role || user?.user_metadata?.role || "user";
  const firstName = user?.user_metadata?.firstName || "Customer";

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Hello, {firstName}!
            </h1>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
              {role}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 border border-gray-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            <BiLogOut className="text-base" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg text-2xl">
            <BiShoppingBag />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">My Orders</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{orders.length} Placed</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-2xl">
            <BiCheckCircle />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Account Status</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">Active Buyer</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg text-2xl">
            <BiUser />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Email Verified</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">Verified</h3>
          </div>
        </div>
      </div>

      {/* Orders List Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 text-lg">My Orders &amp; Deliveries</h2>
          <span className="text-xs text-gray-400">Order updates and pickup PIN codes</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <BiShoppingBag className="mx-auto text-4xl text-gray-300 mb-2" />
            <h3 className="font-bold text-slate-800 text-base">No orders yet</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Browse products from top brands and verified vendors across the marketplace.
            </p>
            <Link
              href="/shop"
              className="bg-primary text-white text-xs font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => {
              const isPickup = order.fulfillmentType === "pickup";
              const items = Array.isArray(order.items) ? order.items : [];
              const pickupStation = order.pickupStation as any;

              return (
                <div key={order.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        #{order.paystackReference || order.id.substring(0, 8)}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {order.fulfillmentType === "pickup" ? "🏪 Station Pickup" : "🚚 Home Delivery"}
                      </span>
                      <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* If Pickup Station: Highlight the PIN code */}
                  {isPickup && order.pickupCode && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 my-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                          Pickup Verification Code:
                        </div>
                        <div className="font-mono font-black text-2xl text-blue-900 tracking-wider">
                          {order.pickupCode}
                        </div>
                        {pickupStation && (
                          <div className="text-xs text-blue-700 mt-0.5">
                            Hub: <strong>{pickupStation.name}</strong> ({pickupStation.address})
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyCode(order.pickupCode)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <BiCopy />
                        <span>Copy PIN</span>
                      </button>
                    </div>
                  )}

                  {/* Items in this order */}
                  <div className="space-y-1 mt-2 text-xs text-gray-600">
                    {items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center py-1">
                        <span>
                          {item.name} &times; <strong>{item.quantity}</strong>
                          {item.storeName && (
                            <span className="text-primary text-[11px] ml-1">({item.storeName})</span>
                          )}
                        </span>
                        <span className="font-medium text-slate-800">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      Payment: <strong className="text-emerald-600 capitalize">{order.paymentStatus}</strong> via Paystack
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      Total: KES {Number(order.totalAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
