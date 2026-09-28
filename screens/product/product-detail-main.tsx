"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next-nprogress-bar";
import { BsShieldCheck, BsTruck, BsCartCheck, BsTrash } from "react-icons/bs";
import { BiStore, BiArrowBack, BiPlus, BiMinus, BiCheck } from "react-icons/bi";
import { useCartStore } from "@/lib/zustand/cart-store";
import { useI18nStore } from "@/lib/i18n/store";
import { getOriginalPrice } from "@/lib/utils";
import { toast } from "react-toastify";
import defaultProductImg from "@/public/images/63e8c4e4aed3c6720e446aa1_airpod max-min.png";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: number;
    shortDescription?: string | null;
    longDescription?: string | null;
    stock: number;
    discount?: number | null;
    images?: string[] | any;
    sizes?: string[] | any;
    colorVariants?: any;
    label?: string;
    type?: string | null;
    vendorId?: string | null;
    storeName?: string | null;
  };
}

export default function ProductDetailMain({ product }: ProductDetailProps) {
  const router = useRouter();
  const { formatPrice, formatNumber, t, tp } = useI18nStore();
  const discount = product.discount && product.discount > 0 ? product.discount : 0;
  const discountText = formatNumber(discount / 100, { style: "percent" });
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((i) => i.productId === product.id);
  const isInCart = Boolean(cartItem);

  // Images resolution
  const rawImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [defaultProductImg];
  const [selectedImage, setSelectedImage] = useState(rawImages[0]);

  // Sizes & Colors
  const availableSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes[0] || ""
  );

  const availableColors = Array.isArray(product.colorVariants)
    ? product.colorVariants
    : [];
  const [selectedColor, setSelectedColor] = useState<string>(
    typeof availableColors[0] === "string"
      ? availableColors[0]
      : availableColors[0]?.name || ""
  );

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error(t("product.outOfStockToast"));
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: typeof selectedImage === "string" ? selectedImage : undefined,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      vendorId: product.vendorId || undefined,
      storeName: product.storeName || undefined,
      stock: product.stock,
    });

    toast.success(t("product.addedToCartToast", { quantity, name: product.name }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const getValidImgSrc = (img: any) => {
    if (!img) return defaultProductImg;
    if (typeof img === "object") return img;
    if (typeof img === "string" && (img.startsWith("http") || img.startsWith("/"))) {
      return img;
    }
    return defaultProductImg;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          {t("nav.home")}
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-primary transition-colors">
          {t("nav.shop")}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row-reverse gap-4">
          {/* Main Hero Image */}
          <div className="relative flex-1 aspect-square bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center p-6">
            <Image
              src={getValidImgSrc(selectedImage)}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
            />
            {discount > 0 && (
              <span
                className="absolute top-4 left-4 rounded-full bg-deal px-3 py-1 text-xs font-semibold text-white tabular-nums"
                aria-label={t("products.discountLabel", { percent: discountText })}
              >
                -{discountText}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {rawImages.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px] scrollbar-none">
              {rawImages.map((img: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-gray-50 p-2 cursor-pointer transition-all ${
                    selectedImage === img
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={getValidImgSrc(img)}
                    alt=""
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Purchasing & Specs */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Product Label / Category */}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              {product.label || t("product.exclusive")}
            </span>
            {product.stock > 0 ? (
              <span className="text-emerald-700 bg-emerald-50 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <BiCheck className="text-base" /> {t("product.inStockCount", { count: product.stock })}
              </span>
            ) : (
              <span className="text-red-700 bg-red-50 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {t("products.outOfStock")}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 my-3">
            <span className="text-3xl font-black text-primary tabular-nums">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <s className="text-lg text-gray-400 tabular-nums">
                <span className="sr-only">{t("products.originalPrice")}: </span>
                {formatPrice(getOriginalPrice(product.price, discount))}
              </s>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && /<[a-z][\s\S]*>/i.test(product.shortDescription) ? (
            <div
              className="text-sm text-gray-600 leading-relaxed mb-6 [&_p]:mb-1"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {product.shortDescription || t("product.defaultDescription")}
            </p>
          )}

          <hr className="border-gray-100 mb-6" />

          {/* Size Options */}
          {availableSizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                {t("product.selectSize")}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sz: string) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? "border-primary bg-primary text-white shadow-xs"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Options */}
          {availableColors.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                {t("product.selectColor")} <span className="font-normal text-slate-800 capitalize">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((cl: any) => {
                  const colorName = typeof cl === "string" ? cl : cl.name;
                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => setSelectedColor(colorName)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        selectedColor === colorName
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {colorName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cart Status & Actions */}
          {isInCart && cartItem ? (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {tp("product.cartItemCount", cartItem.quantity)}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {t("product.subtotal")} <strong className="text-slate-900">{formatPrice(cartItem.price * cartItem.quantity)}</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Direct Quantity Value Updaters */}
                <div className="flex items-center border border-primary/30 rounded-xl bg-white shadow-xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      if (cartItem.quantity <= 1) {
                        removeItem(cartItem.id);
                        toast.info(t("product.removedFromCartToast", { name: product.name }));
                      } else {
                        updateQuantity(cartItem.id, cartItem.quantity - 1);
                      }
                    }}
                    className="p-3 text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    aria-label={t("products.decreaseQuantity")}
                  >
                    <BiMinus className="text-sm" />
                  </button>
                  <span className="px-5 text-sm font-bold text-slate-900 min-w-[2.5rem] text-center">
                    {cartItem.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (cartItem.quantity < (product.stock || 99)) {
                        updateQuantity(cartItem.id, cartItem.quantity + 1);
                      } else {
                        toast.warning(t("product.maxStockToast", { stock: product.stock }));
                      }
                    }}
                    className="p-3 text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    aria-label={t("products.increaseQuantity")}
                    disabled={cartItem.quantity >= (product.stock || 99)}
                  >
                    <BiPlus className="text-sm" />
                  </button>
                </div>

                {/* View in Cart button */}
                <Link
                  href="/cart"
                  className="flex-1 min-w-[140px] py-3 px-5 rounded-xl font-bold text-sm bg-primary text-white hover:opacity-95 text-center transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <BsCartCheck className="text-base" />
                  {t("product.viewInCart")}
                </Link>

                {/* Remove item button */}
                <button
                  type="button"
                  onClick={() => {
                    removeItem(cartItem.id);
                    toast.info(t("product.removedFromCartToast", { name: product.name }));
                  }}
                  className="p-3 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title={t("product.removeFromCart")}
                  aria-label={t("product.removeFromCart")}
                >
                  <BsTrash className="text-base" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  {t("product.quantity")}
                </span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                    disabled={quantity <= 1}
                  >
                    <BiMinus className="text-sm" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                    className="p-2.5 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                    disabled={quantity >= product.stock}
                  >
                    <BiPlus className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("products.addToCart")}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("product.buyNow")}
                </button>
              </div>
            </>
          )}

          {/* Seller & Trust Badges */}
          <div className="border border-gray-200 rounded-xl p-4 bg-slate-50 space-y-3 text-xs text-gray-600">
            <div className="flex items-center gap-2.5">
              <BiStore className="text-lg text-primary" />
              <span>
                {t("product.soldBy")} <strong>{product.storeName || t("product.officialSeller")}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <BsTruck className="text-lg text-emerald-600" />
              <span>
                {t("product.deliveryAvailability", {
                  delivery: t("product.expressDelivery"),
                  pickup: t("product.pickupCollection"),
                })}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <BsShieldCheck className="text-lg text-blue-600" />
              <span>{t("product.secureCheckout")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Long Description and Specs Section */}
      {product.longDescription && (
        <section className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t("product.detailsHeading")}</h2>
          <div
            className="prose prose-slate max-w-none text-sm text-gray-700 leading-relaxed [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:mb-4 [&_li]:text-gray-600 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: product.longDescription }}
          />
        </section>
      )}
    </main>
  );
}
