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
  BiPackage,
  BiCheck,
  BiX,
  BiTrash,
  BiRefresh,
} from "react-icons/bi";
import { toast } from "react-toastify";
import { VendorDashboardSkeleton } from "@/components/shared/skeletons";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "vendors" | "products" | "orders">("overview");

  // Admin Data states
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalVendors: 0, totalOrders: 0, platformGMV: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
      await loadAdminData();
      setLoading(false);
    }
    init();
  }, []);

  const loadAdminData = async () => {
    setRefreshing(true);
    try {
      const [mRes, uRes, vRes, pRes, oRes] = await Promise.all([
        fetch("/api/admin/metrics").then((r) => r.json()),
        fetch("/api/admin/users").then((r) => r.json()),
        fetch("/api/admin/vendors").then((r) => r.json()),
        fetch("/api/admin/products").then((r) => r.json()),
        fetch("/api/admin/orders").then((r) => r.json()),
      ]);

      if (mRes.success) setMetrics(mRes.data);
      if (uRes.success) setUsers(uRes.data);
      if (vRes.success) setVendors(vRes.data);
      if (pRes.success) setProducts(pRes.data);
      if (oRes.success) setOrders(oRes.data);
    } catch (err) {
      console.error("Failed loading admin data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "user" | "vendor" | "admin") => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`User role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch (e: any) {
      toast.error(e.message || "Network error updating role");
    }
  };

  const handleToggleVendorVerify = async (vendorId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !currentStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Vendor verification updated`);
        setVendors((prev) =>
          prev.map((v) => (v.id === vendorId ? { ...v, isVerified: !currentStatus } : v))
        );
      } else {
        toast.error(data.message || "Failed updating vendor");
      }
    } catch (e: any) {
      toast.error(e.message || "Network error");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Product deleted");
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } else {
        toast.error(data.message || "Failed deleting product");
      }
    } catch (e: any) {
      toast.error(e.message || "Network error");
    }
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Order status changed to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error(data.message || "Failed updating status");
      }
    } catch (e: any) {
      toast.error(e.message || "Network error");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
  };

  if (loading) {
    return <VendorDashboardSkeleton />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Control Center</h1>
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Superuser
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">Logged in as: {user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            <BiRefresh className={`text-base ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-medium rounded-lg hover:bg-red-600/30 transition-colors cursor-pointer"
          >
            <BiLogOut className="text-base" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-2xl">
            <BiGroup />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Registered Users</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{metrics.totalUsers}</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-2xl">
            <BiStore />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Active Vendors</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{metrics.totalVendors}</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg text-2xl">
            <BiPackage />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Platform Orders</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{metrics.totalOrders}</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg text-2xl">
            <BiBarChartSquare />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Total Paid Volume</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              KES {Number(metrics.platformGMV).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-2 mb-6 overflow-x-auto">
        {(["overview", "users", "vendors", "products", "orders"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-5 text-sm font-bold capitalize transition-colors border-b-2 cursor-pointer ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">Platform Quick Status</h3>
            <ul className="divide-y divide-gray-100 text-sm space-y-3">
              <li className="pt-2 flex justify-between">
                <span className="text-gray-500">Paystack Gateway:</span>
                <span className="text-emerald-600 font-bold">Active (@paystack/inline-js)</span>
              </li>
              <li className="pt-2 flex justify-between">
                <span className="text-gray-500">Email System:</span>
                <span className="text-emerald-600 font-bold">Unified (Resend &amp; Brevo)</span>
              </li>
              <li className="pt-2 flex justify-between">
                <span className="text-gray-500">Fulfillment Engine:</span>
                <span className="text-blue-600 font-bold">Home Delivery &amp; Pickup Station PINs</span>
              </li>
              <li className="pt-2 flex justify-between">
                <span className="text-gray-500">Total Products Listed:</span>
                <span className="font-bold text-slate-900">{products.length}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">Recent Orders Snippet</h3>
            {orders.length === 0 ? (
              <p className="text-xs text-gray-400">No platform orders placed yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 4).map((o) => (
                  <div key={o.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <div className="font-mono font-bold text-slate-800">{o.paystackReference || o.id.substring(0, 8)}</div>
                      <div className="text-gray-500 text-[11px]">{o.customerEmail} &bull; {o.fulfillmentType}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900">KES {Number(o.totalAmount).toLocaleString()}</span>
                      <div className="text-emerald-600 font-bold capitalize">{o.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === "users" && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Platform Users ({users.length})</h3>
            <span className="text-xs text-gray-500">Promote or demote roles in real-time</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Date Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-semibold text-slate-900">
                      {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}` : "Unnamed"}
                    </td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          u.role === "admin"
                            ? "bg-red-100 text-red-700"
                            : u.role === "vendor"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                        className="border border-gray-200 rounded px-2 py-1 text-xs outline-none bg-white cursor-pointer"
                      >
                        <option value="user">Customer (User)</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Vendors Management */}
      {activeTab === "vendors" && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Vendors &amp; Merchants ({vendors.length})</h3>
            <span className="text-xs text-gray-500">Verify stores and moderate merchant access</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Store Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Verified</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-slate-900">{v.storeName}</td>
                    <td className="p-4 font-mono text-gray-500">{v.storeSlug}</td>
                    <td className="p-4">
                      {v.isVerified ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          Verified
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {v.isActive ? (
                        <span className="text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleVendorVerify(v.id, v.isVerified)}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                          v.isVerified
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {v.isVerified ? "Revoke Verification" : "Approve Store"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Products Management */}
      {activeTab === "products" && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Catalog Products ({products.length})</h3>
            <span className="text-xs text-gray-500">Moderate product listings across all stores</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Label</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-semibold text-slate-900">
                      <Link href={`/product/${p.id}`} className="hover:text-primary transition-colors">
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-4 font-bold text-primary">KES {Number(p.price).toLocaleString()}</td>
                    <td className="p-4 font-medium">{p.stock} units</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                        {p.label || "Regular"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 cursor-pointer"
                        title="Delete Product"
                      >
                        <BiTrash className="text-base" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Orders Oversight */}
      {activeTab === "orders" && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">All Platform Orders ({orders.length})</h3>
            <span className="text-xs text-gray-500">Live order fulfillment and status controls</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Fulfillment</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-mono font-bold text-slate-800">
                      {o.paystackReference || o.id.substring(0, 8)}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{o.customerEmail}</div>
                      {o.customerPhone && <div className="text-gray-400 text-[11px]">{o.customerPhone}</div>}
                    </td>
                    <td className="p-4">
                      <span className="capitalize font-semibold text-slate-700">{o.fulfillmentType}</span>
                      {o.pickupCode && (
                        <div className="font-mono text-blue-600 text-[11px] font-bold">
                          PIN: {o.pickupCode}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-extrabold text-slate-900">
                      KES {Number(o.totalAmount).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px]">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                        className="border border-gray-200 rounded px-2 py-1 text-xs outline-none bg-white cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Processing">Processing</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
