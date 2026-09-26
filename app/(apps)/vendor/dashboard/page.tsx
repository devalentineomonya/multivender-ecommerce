"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next-nprogress-bar";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  BiStore,
  BiPackage,
  BiDollarCircle,
  BiTrendingUp,
  BiPlus,
  BiLogOut,
} from "react-icons/bi";

export default function VendorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    loadUser();
  }, []);

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

  const storeName =
    user?.user_metadata?.storeName ||
    `${user?.user_metadata?.firstName || "Merchant"}'s Store`;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {storeName}
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Vendor Portal
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Logged in as {user?.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <BiPlus className="text-lg" />
            <span>Add Product</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            <BiLogOut className="text-lg" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-2xl">
            <BiDollarCircle />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Total Revenue</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">$0.00</h3>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-2xl">
            <BiPackage />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Orders</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">0 Orders</h3>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg text-2xl">
            <BiStore />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Active Products</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">0 Listed</h3>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg text-2xl">
            <BiTrendingUp />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Store Status</p>
            <h3 className="text-xl font-bold text-purple-600 mt-0.5">Active</h3>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center py-12">
        <BiStore className="mx-auto text-5xl text-gray-400 mb-3" />
        <h3 className="text-lg font-semibold text-slate-800">
          Welcome to your Vendor Dashboard
        </h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto mt-1 mb-6">
          Start listing products, managing inventory, and tracking customer orders directly from this portal.
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
        >
          &larr; View Marketplace Front
        </Link>
      </div>
    </main>
  );
}
