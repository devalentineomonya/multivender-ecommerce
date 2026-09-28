"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiMapPin } from "react-icons/bi";
import { useI18nStore } from "@/lib/i18n/store";
import type { TranslationKey } from "@/lib/i18n/translations";

/** The field shape is locale-independent; only the validation messages change per locale. */
function getDeliveryValidationSchema(t: (key: TranslationKey) => string) {
  return z.object({
    firstName: z.string().min(2, t("cart.delivery.errors.firstName")),
    lastName: z.string().min(2, t("cart.delivery.errors.lastName")),
    address: z.string().min(3, t("cart.delivery.errors.address")),
    town: z.string().min(2, t("cart.delivery.errors.town")),
    zip: z.string().optional(),
    email: z.string().email(t("cart.delivery.errors.email")),
    number: z.string().min(8, t("cart.delivery.errors.phone")),
    notes: z.string().optional(),
  });
}

export type DeliveryFormValues = z.infer<ReturnType<typeof getDeliveryValidationSchema>>;

interface CartDeliveryInfoFormProps {
  values: DeliveryFormValues;
  onChange: (values: DeliveryFormValues) => void;
}

const CartDeliveryInfoForm: React.FC<CartDeliveryInfoFormProps> = ({
  values,
  onChange,
}) => {
  const { t } = useI18nStore();
  const schema = useMemo(() => getDeliveryValidationSchema(t), [t]);

  const {
    register,
    formState: { errors },
  } = useForm<DeliveryFormValues>({
    resolver: zodResolver(schema),
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
        <h3 className="text-lg font-bold text-slate-900">{t("cart.delivery.heading")}</h3>
      </div>
      <p className="text-xs text-gray-500 mb-5">{t("cart.delivery.description")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            {t("cart.delivery.firstName")}
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
            {t("cart.delivery.lastName")}
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
            {t("cart.delivery.address")}
          </label>
          <input
            {...register("address")}
            defaultValue={values.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            placeholder={t("cart.delivery.addressPlaceholder")}
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            {t("cart.delivery.town")}
          </label>
          <input
            {...register("town")}
            defaultValue={values.town}
            onChange={(e) => handleFieldChange("town", e.target.value)}
            placeholder={t("cart.delivery.townPlaceholder")}
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.town && (
            <p className="text-red-500 text-xs mt-1">{errors.town.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            {t("cart.delivery.zip")}
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
            {t("cart.delivery.email")}
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
            {t("cart.delivery.phone")}
          </label>
          <input
            type="tel"
            {...register("number")}
            defaultValue={values.number}
            onChange={(e) => handleFieldChange("number", e.target.value)}
            placeholder={t("cart.delivery.phonePlaceholder")}
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.number && (
            <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            {t("cart.delivery.notes")}
          </label>
          <input
            {...register("notes")}
            defaultValue={values.notes}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
            placeholder={t("cart.delivery.notesPlaceholder")}
            className="w-full border border-gray-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default CartDeliveryInfoForm;
