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
  BiPlus,
  BiLogOut,
  BiTrash,
  BiCog,
  BiCheck,
  BiX,
  BiChevronLeft,
  BiChevronRight,
} from "react-icons/bi";
import { toast } from "react-toastify";
import { VendorDashboardSkeleton } from "@/components/shared/skeletons";

export default function VendorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "settings">("products");

  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Add Product Modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "10",
    shortDescription: "",
    longDescription: "",
    label: "New",
    budgetTier: "mid",
    isHot: false,
    isSponsored: false,
    categoryId: "",
    type: "Physical",
    imageUrl: "",
    sizes: "S, M, L, XL",
    colors: "Black, White",
  });

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
      await loadVendorData();
      setLoading(false);
    }
    init();
  }, []);

  const loadVendorData = async (page = 1) => {
    try {
      const [pRes, prodRes, ordRes, catRes] = await Promise.all([
        fetch("/api/vendor/profile").then((r) => r.json()),
        fetch(`/api/vendor/products?page=${page}&limit=10`).then((r) => r.json()),
        fetch("/api/vendor/orders").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
      ]);

      if (pRes.success) setProfile(pRes.data);
      if (prodRes.success) {
        setProducts(prodRes.data);
        if (prodRes.pagination) setPagination(prodRes.pagination);
      }
      if (ordRes.success) setOrders(ordRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (e) {
      console.error("Error loading vendor data:", e);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast.error("Please fill in product name and price");
      return;
    }

    const sizesArr = newProduct.sizes
      ? newProduct.sizes.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const colorsArr = newProduct.colors
      ? newProduct.colors.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

    const imagesArr = newProduct.imageUrl.trim()
      ? [newProduct.imageUrl.trim()]
      : ["/images/63e8c4e4aed3c6720e446aa1_airpod max-min.png"];

    try {
      const res = await fetch("/api/vendor/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock) || 10,
          shortDescription: newProduct.shortDescription,
          longDescription: newProduct.longDescription,
          label: newProduct.label,
          budgetTier: newProduct.budgetTier,
          isHot: newProduct.isHot,
          isSponsored: newProduct.isSponsored,
          categoryIds: newProduct.categoryId ? [newProduct.categoryId] : [],
          type: newProduct.type,
          images: imagesArr,
          sizes: sizesArr,
          colorVariants: colorsArr,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Product listed successfully!");
        setProducts((prev) => [data.data, ...prev]);
        setIsAddProductOpen(false);
        setNewProduct({
          name: "",
          price: "",
          stock: "10",
          shortDescription: "",
          longDescription: "",
          label: "New",
          budgetTier: "mid",
          isHot: false,
          isSponsored: false,
          categoryId: "",
          type: "Physical",
          imageUrl: "",
          sizes: "S, M, L, XL",
          colors: "Black, White",
        });
        loadVendorData(1);
      } else {
        toast.error(data.message || "Failed creating product");
      }
    } catch (err: any) {
      toast.error(err.message || "Network error");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/vendor/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Product deleted");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error(data.message || "Failed deleting product");
      }
    } catch (e: any) {
      toast.error(e.message || "Network error");
    }
  };

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: profile.storeName,
          description: profile.description,
          phoneNumber: profile.phoneNumber,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Store details updated");
      } else {
        toast.error(data.message || "Failed updating store");
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

  const storeName = profile?.storeName || `${user?.user_metadata?.firstName || "Merchant"}'s Store`;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{storeName}</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {profile?.isVerified ? "Verified Merchant" : "Pending Verification"}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Logged in as {user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <BiPlus className="text-base" />
            <span>Add New Product</span>
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-gray-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            <BiLogOut className="text-base" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-2xl">
            <BiDollarCircle />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Store Products</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{products.length} Listed</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-2xl">
            <BiPackage />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Fulfillment Orders</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{orders.length} Orders</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg text-2xl">
            <BiStore />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Store Verification</p>
            <h3 className="text-2xl font-bold text-purple-600 mt-0.5">
              {profile?.isVerified ? "Verified" : "Under Review"}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2 mb-6">
        {(["products", "orders", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-5 text-sm font-bold capitalize transition-all border-b-2 cursor-pointer ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab === "products" ? "My Products" : tab === "orders" ? "Store Orders" : "Store Settings"}
          </button>
        ))}
      </div>

      {/* Tab: Products */}
      {activeTab === "products" && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Your Listed Products ({products.length})</h3>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="text-xs bg-primary text-white font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              + Add Product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 px-4">
              <BiStore className="mx-auto text-4xl text-gray-400 mb-2" />
              <h4 className="font-bold text-slate-800 text-base">No Products Listed Yet</h4>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Start listing your items to make them visible to thousands of buyers on the marketplace.
              </p>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="bg-primary text-white text-xs font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Create Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Inventory</th>
                    <th className="p-4">Label</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-slate-900">
                        <Link href={`/product/${p.id}`} className="hover:text-primary transition-colors">
                          {p.name}
                        </Link>
                      </td>
                      <td className="p-4 font-bold text-primary">KES {Number(p.price).toLocaleString()}</td>
                      <td className="p-4 font-medium">{p.stock} in stock</td>
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50 text-xs">
                  <span className="text-gray-500">
                    Showing page <strong className="text-slate-800">{pagination.page}</strong> of{" "}
                    <strong className="text-slate-800">{pagination.totalPages}</strong> ({pagination.total} products)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={pagination.page <= 1}
                      onClick={() => loadVendorData(pagination.page - 1)}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <BiChevronLeft className="text-base" /> Previous
                    </button>
                    <button
                      type="button"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => loadVendorData(pagination.page + 1)}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      Next <BiChevronRight className="text-base" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === "orders" && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Fulfillment Orders ({orders.length})</h3>
            <span className="text-xs text-gray-500">Orders containing your products</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 px-4">
              <BiPackage className="mx-auto text-4xl text-gray-400 mb-2" />
              <h4 className="font-bold text-slate-800 text-base">No Orders Yet</h4>
              <p className="text-xs text-gray-500 mt-1">
                When customers purchase your items, order notifications and shipping instructions will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-4">Order Ref</th>
                    <th className="p-4">Items Ordered</th>
                    <th className="p-4">Fulfillment</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {o.paystackReference || o.id.substring(0, 8)}
                      </td>
                      <td className="p-4">
                        {(o.vendorItems || []).map((vi: any, idx: number) => (
                          <div key={idx} className="font-medium text-slate-800">
                            {vi.name} x{vi.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="p-4 capitalize font-semibold text-slate-700">
                        {o.fulfillmentType}
                        {o.pickupCode && <span className="block text-[11px] text-blue-600 font-mono">PIN: {o.pickupCode}</span>}
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Store Settings */}
      {activeTab === "settings" && profile && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs max-w-2xl">
          <h3 className="font-bold text-slate-900 text-base mb-4">Store Details</h3>
          <form onSubmit={handleUpdateStore} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Store Name</label>
              <input
                type="text"
                value={profile.storeName || ""}
                onChange={(e) => setProfile({ ...profile, storeName: e.target.value })}
                className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Store Contact Phone</label>
              <input
                type="text"
                value={profile.phoneNumber || ""}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                placeholder="+254 700 000 000"
                className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Store Description</label>
              <textarea
                rows={3}
                value={profile.description || ""}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                placeholder="Brief summary of what your store sells..."
                className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg text-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save Store Settings
            </button>
          </form>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-slate-900 text-lg">Add New Product</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
              >
                <BiX />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Title*</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price (KES)*</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="2500"
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Stock*</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="10"
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="w-full border border-gray-200 px-2 py-2 rounded-lg text-xs outline-none focus:border-primary bg-white cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Product Label</label>
                  <select
                    value={newProduct.label}
                    onChange={(e) => setNewProduct({ ...newProduct, label: e.target.value })}
                    className="w-full border border-gray-200 px-2 py-2 rounded-lg text-xs outline-none focus:border-primary bg-white cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Hot">Hot</option>
                    <option value="Featured">Featured</option>
                    <option value="Trending">Trending</option>
                    <option value="BestSelling">Best Selling</option>
                    <option value="Popular">Popular</option>
                    <option value="Sponsored">Sponsored</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Budget Tier</label>
                  <select
                    value={newProduct.budgetTier}
                    onChange={(e) => setNewProduct({ ...newProduct, budgetTier: e.target.value })}
                    className="w-full border border-gray-200 px-2 py-2 rounded-lg text-xs outline-none focus:border-primary bg-white cursor-pointer"
                  >
                    <option value="budget">Budget (&lt; 3k KES)</option>
                    <option value="mid">Mid-range (3k-15k KES)</option>
                    <option value="premium">Premium (15k+ KES)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image URL (or unspash/png link)</label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={newProduct.sizes}
                    onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={newProduct.colors}
                    onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                    placeholder="Black, Silver, Blue"
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newProduct.shortDescription}
                  onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                  placeholder="Key features and selling points..."
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-bold rounded-lg hover:opacity-90 cursor-pointer"
                >
                  Save and Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
