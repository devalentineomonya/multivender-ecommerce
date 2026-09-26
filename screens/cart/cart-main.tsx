"use client";
import { useState, ChangeEvent } from "react";
// import BreadCrumb
import CartDeliveryInfoForm from "./cart-delivery-info-form";
import CartItemCard from "./cart-item-card";
import CartPayment from "./cart-payment";
import CartDeliveryInfoCard from "./cart-delivery-info-card";

const CartMain = () => {
  const [returning, setReturning] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReturning(e.target.checked);
  };

  return (
    <div className="min-h-[calc(100vh-15rem)] h-fit">
      {/* <BreadCrumb /> */}
      <div className="flex gap-x-12 flex-col md:flex-row">
        <div className="w-full md:w-3/5">
          <div className="border border-gray-200 rounded-md p-3 sm:p-6">
            <h5 className="font-semibold text-slate-900 text-xl">
              Items Review and Shipping
            </h5>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
              <CartItemCard />
              <CartItemCard />
              <CartItemCard />
              <CartItemCard />
              <CartItemCard />
              <CartItemCard />
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-6 flex gap-x-3 items-center">
            <label htmlFor="returning">Returning Customer</label>
            <input
              type="checkbox"
              name="returning"
              id="returning"
              onChange={handleChange}
            />
          </div>
          {returning ? <CartDeliveryInfoCard /> : <CartDeliveryInfoForm />}
        </div>
        <CartPayment />
      </div>
    </div>
  );
};

export default CartMain;
