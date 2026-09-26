"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  SupportedLocale,
  SupportedCurrency,
  CURRENCIES,
  LOCALES,
  DEFAULT_LOCALE,
  DEFAULT_CURRENCY,
} from "./config";
import { translations } from "./translations";

interface I18nState {
  locale: SupportedLocale;
  currency: SupportedCurrency;
  country: string;
  setLocale: (locale: SupportedLocale) => void;
  setCurrency: (currency: SupportedCurrency) => void;
  setCountry: (country: string) => void;
  t: (key: string, fallback?: string) => string;
  convertPrice: (priceInKES: number) => number;
  formatPrice: (priceInKES: number) => string;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: DEFAULT_LOCALE,
      currency: DEFAULT_CURRENCY,
      country: "KE",

      setLocale: (locale: SupportedLocale) => {
        if (LOCALES[locale]) {
          set({ locale });
        }
      },

      setCurrency: (currency: SupportedCurrency) => {
        if (CURRENCIES[currency]) {
          set({ currency });
        }
      },

      setCountry: (country: string) => {
        set({ country });
      },

      t: (key: string, fallback?: string) => {
        const { locale } = get();
        const localized = translations[locale]?.[key];
        if (localized) return localized;
        const defaultLocalized = translations[DEFAULT_LOCALE]?.[key];
        return defaultLocalized || fallback || key;
      },

      convertPrice: (priceInKES: number) => {
        if (typeof priceInKES !== "number" || isNaN(priceInKES)) return 0;
        const { currency } = get();
        const currencyInfo = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
        return Math.round(priceInKES * currencyInfo.rateFromKES);
      },

      formatPrice: (priceInKES: number) => {
        if (typeof priceInKES !== "number" || isNaN(priceInKES)) {
          return "KSh 0";
        }
        const { currency } = get();
        const currencyInfo = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
        const converted = priceInKES * currencyInfo.rateFromKES;

        if (currency === "KES" || currency === "UGX" || currency === "TSH") {
          const formattedNumber = new Intl.NumberFormat().format(Math.round(converted));
          return `${currencyInfo.symbol} ${formattedNumber}`;
        }

        // For USD, EUR, GBP
        const formattedNumber = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
          maximumFractionDigits: 2,
        }).format(converted);
        return `${currencyInfo.symbol} ${formattedNumber}`;
      },
    }),
    {
      name: "ecommerce-i18n-storage-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        locale: state.locale,
        currency: state.currency,
        country: state.country,
      }),
    }
  )
);
