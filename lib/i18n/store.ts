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
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (priceInUSD: number) => string;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: DEFAULT_LOCALE,
      currency: DEFAULT_CURRENCY,
      country: "US",

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

      convertPrice: (priceInUSD: number) => {
        const { currency } = get();
        const currencyInfo = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
        return Math.round(priceInUSD * currencyInfo.rateToUSD);
      },

      formatPrice: (priceInUSD: number) => {
        const { currency } = get();
        const currencyInfo = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
        const converted = Math.round(priceInUSD * currencyInfo.rateToUSD);
        // Format with thousand separators
        const formattedNumber = new Intl.NumberFormat().format(converted);
        return `${currencyInfo.symbol} ${formattedNumber}`;
      },
    }),
    {
      name: "ecommerce-i18n-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        locale: state.locale,
        currency: state.currency,
        country: state.country,
      }),
    }
  )
);
