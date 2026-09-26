"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next-nprogress-bar";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  BiShieldQuarter,
  BiGroup,
  BiStore,
  BiBarChartSquare,
  BiLogOut,
  BiCog,
} from "react-icons/bi";

export default function AdminDashboard() {
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

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Admin Control Center
            </h1>
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Administrator
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Superuser authenticated: {user?.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 text-sm font-medium rounded-lg hover:bg-red-600/30 transition-colors cursor-pointer"
          >
            <BiLogOut className="text-lg" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-2xl">
            <BiGroup />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Registered Users</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">Platform Users</h3>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-2xl">
            <BiStore />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Active Vendors</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">All Merchants</h3>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg text-2xl">
            <BiBarChartSquare />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Platform GMV</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">Metrics</h3>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg text-2xl">
            <BiShieldQuarter />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Security Status</p>
            <h3 className="text-xl font-bold text-emerald-600 mt-0.5">RLS Protected</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Role Access Overview
            </h3>
            <BiCog className="text-gray-400 text-xl" />
          </div>
          <ul className="divide-y divide-gray-100 text-sm">
            <li className="py-3 flex justify-between items-center">
              <span className="font-medium text-slate-700">Admin</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono">
                Full platform access
              </span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span className="font-medium text-slate-700">Vendor</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-mono">
                Store & product management
              </span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span className="font-medium text-slate-700">Customer (User)</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">
                Shopping & order history
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Admin Quick Actions
            </h3>
            <BiShieldQuarter className="text-gray-400 text-xl" />
          </div>
          <div className="space-y-3">
            <Link
              href="/instruments"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <p className="font-semibold text-slate-800 text-sm">
                View Supabase Instruments Table
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                Verify live database connectivity & Server Components
              </p>
            </Link>
            <Link
              href="/"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <p className="font-semibold text-slate-800 text-sm">
                Return to Storefront
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                Browse products as a buyer
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
