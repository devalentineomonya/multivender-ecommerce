"use client";
import { useState, ChangeEvent } from "react";
import { BiCreditCard } from "react-icons/bi";
import Image from "next/image";

import footerPaymentMethod from "@/components/common/footer/footerpaymentmethods";

const CartPayment = () => {
  const paymentMethods = [
    { value: "cash", label: "Cash on Delivery", checked: true },
    { value: "SCard", label: "Shopping cart Card" },
    { value: "paypal", label: "Paypal" },
    { value: "credit", label: "Credit or Debit card" },
  ];

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div className="w-full md:w-2/5 border border-gray-100 rounded-md p-6">
      <h2 className="text-2xl font-semibold text-slate-700 border-b-2 border-b-gray-100 pb-3">
        Order Summary
      </h2>

      <div className="flex relative py-2 rounded-full w-full bg-gray-100 my-5 px-6 items-center">
        <input
          autoComplete="off"
          name="coupon"
          type="text"
          placeholder="Enter Coupon Code"
          maxLength={8}
          minLength={0}
          className="outline-none border-none bg-transparent w-3/4 uppercase placeholder:capitalize text-sm"
        />
        <button className="absolute right-1 py-[0.3rem] rounded-full bg-primary text-white px-3 text-sm">
          Apply Coupon
        </button>
      </div>

      <h4 className="text-xl font-semibold text-slate-700 mb-2 border-t-2 border-b-gray-100 pt-3">
        Payment Details
      </h4>

      {paymentMethods.map((method, i) => (
        <div key={method.value} className="flex gap-x-3 text-sm mt-3 font-medium text-gray-600 items-center">
          <input
            autoComplete="true"
            id={`paymentMethod-${i + 1}`}
            type="radio"
            name="paymentMethod"
            value={method.value}
            checked={method.value === paymentMethod}
            onChange={handleInputChange}
          />
          <label htmlFor={`paymentMethod-${i + 1}`}>{method.label}</label>
        </div>
      ))}

      {paymentMethod === "credit" && (
        <div className="mt-4">
          <div className="flex gap-x-2 mt-3">
            {footerPaymentMethod.map((method) => (
              <Image
                src={method.image}
                alt={method.name ?? "payment-method-image"}
                key={method.name}
                loading="lazy"
              />
            ))}
          </div>
          <form className="mt-4 space-y-3">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email*
              </label>
              <input
                autoComplete="email"
                type="email"
                name="email"
                id="email"
                placeholder="Type Here...."
                required
                className="border border-gray-200 px-4 py-2 mt-2 rounded-md outline-none focus:border-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">
                Card Holder Name*
              </label>
              <input
                autoComplete="name"
                type="text"
                name="name"
                id="name"
                placeholder="Type Here...."
                required
                className="border border-gray-200 px-4 py-2 mt-2 rounded-md outline-none focus:border-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="cardNumber" className="text-sm font-medium text-slate-700">
                Card Number*
              </label>
              <div className="flex gap-x-3 items-center mt-2 border border-gray-200 px-4 py-2 rounded-md outline-none">
                <BiCreditCard className="text-gray-500 text-lg" />
                <input
                  autoComplete="cc-number"
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  required
                  className="border-none outline-none w-full bg-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
              <div className="flex flex-col">
                <label htmlFor="expire" className="text-sm font-medium text-slate-700">
                  Expiry Date*
                </label>
                <input
                  type="month"
                  name="expire"
                  id="expire"
                  placeholder="MM/YY"
                  required
                  className="border border-gray-200 px-4 py-2 mt-2 rounded-md outline-none focus:border-gray-400"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="ccc" className="text-sm font-medium text-slate-700">
                  CCC*
                </label>
                <input
                  autoComplete="off"
                  type="number"
                  name="ccc"
                  id="ccc"
                  placeholder="000"
                  required
                  className="border border-gray-200 px-4 py-2 mt-2 rounded-md outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      <table className="w-full mt-5">
        <tbody>
          <tr className="text-slate-800 font-bold">
            <td className="text-start">Item 1</td>
            <td className="text-end">Price 1</td>
          </tr>
          <tr className="text-slate-800 font-bold">
            <td className="text-start">Item 2</td>
            <td className="text-end">Price 2</td>
          </tr>
          <tr className="text-slate-800 font-bold">
            <td className="text-start">Item 3</td>
            <td className="text-end">Price 3</td>
          </tr>
          <tr className="border-b-2 border-b-gray-200 mt-3 w-full"></tr>
          <tr className="text-slate-800 font-bold">
            <td className="text-start">Total</td>
            <td className="text-end">Total Price</td>
          </tr>
        </tbody>
      </table>

      <button className="text-white w-full py-2 px-3 rounded-full bg-primary mx-auto mt-5 hover:opacity-90 transition-opacity">
        Pay 6557#
      </button>

      <div className="w-full rounded-sm h-20 bg-orange-50 mt-4"></div>
    </div>
  );
};

export default CartPayment;
