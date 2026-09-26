"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiMapPin } from "react-icons/bi";

export const deliveryValidationSchema = z.object({
  firstName: z.string().min(2, "First Name is required"),
  lastName: z.string().min(2, "Last Name is required"),
  address: z.string().min(3, "Street address is required"),
  town: z.string().min(2, "City / Town is required"),
  zip: z.string().optional(),
  email: z.string().email("Invalid email address"),
  number: z.string().min(8, "Valid phone number required"),
  notes: z.string().optional(),
});

export type DeliveryFormValues = z.infer<typeof deliveryValidationSchema>;

interface CartDeliveryInfoFormProps {
  values: DeliveryFormValues;
  onChange: (values: DeliveryFormValues) => void;
}

const CartDeliveryInfoForm: React.FC<CartDeliveryInfoFormProps> = ({
  values,
  onChange,
}) => {
  const {
    register,
    formState: { errors },
  } = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryValidationSchema),
    defaultValues: values,
    mode: "onChange",
  });

  const handleFieldChange = (
    field: keyof DeliveryFormValues,
    val: string
  ) => {
    onChange({
      ...values,
      [field]: val,
    });
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 sm:p-6 mt-6 bg-white shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <BiMapPin className="text-xl text-primary" />
        <h3 className="text-lg font-bold text-slate-900">
          Delivery Address & Contact
        </h3>
      </div>
      <p className="text-xs text-gray-500 mb-5">
        Please provide the exact destination where you wish your items delivered. Standard courier delivery fee applies.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            First Name*
          </label>
          <input
            {...register("firstName")}
            defaultValue={values.firstName}
            onChange={(e) => handleFieldChange("firstName", e.target.value)}
            placeholder="John"
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Last Name*
          </label>
          <input
            {...register("lastName")}
            defaultValue={values.lastName}
            onChange={(e) => handleFieldChange("lastName", e.target.value)}
            placeholder="Doe"
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Street Address / Apartment / Landmark*
          </label>
          <input
            {...register("address")}
            defaultValue={values.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            placeholder="e.g. 124 Moi Avenue, Block C, Apt 4B"
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            City / Town*
          </label>
          <input
            {...register("town")}
            defaultValue={values.town}
            onChange={(e) => handleFieldChange("town", e.target.value)}
            placeholder="e.g. Nairobi"
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.town && (
            <p className="text-red-500 text-xs mt-1">{errors.town.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Postal / ZIP Code
          </label>
          <input
            {...register("zip")}
            defaultValue={values.zip}
            onChange={(e) => handleFieldChange("zip", e.target.value)}
            placeholder="00100"
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Email Address*
          </label>
          <input
            type="email"
            {...register("email")}
            defaultValue={values.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            placeholder="john@example.com"
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Phone Number*
          </label>
          <input
            type="tel"
            {...register("number")}
            defaultValue={values.number}
            onChange={(e) => handleFieldChange("number", e.target.value)}
            placeholder="+254 700 000 000"
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.number && (
            <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Delivery Instructions / Rider Notes (Optional)
          </label>
          <input
            {...register("notes")}
            defaultValue={values.notes}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
            placeholder="e.g. Ring the bell at gate 3"
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default CartDeliveryInfoForm;
