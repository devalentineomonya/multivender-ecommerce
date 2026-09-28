"use client";

import { createContext, useContext } from "react";
import { createStore, useStore, type StoreApi } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import {
  SupportedLocale,
  SupportedCurrency,
  I18nSnapshot,
  I18N_COOKIE,
  isSupportedCurrency,
  isSupportedLocale,
  normalizeI18n,
  formatPriceIn,
  formatNumberIn,
  formatDateIn,
} from "./config";
import {
  translate,
  translatePlural,
  type PluralKey,
  type TranslationKey,
  type TranslationVars,
} from "./translations";

export interface I18nState extends I18nSnapshot {
  /** An explicit language pick; country changes stop overriding it afterwards. */
  setLocale: (locale: SupportedLocale) => void;
  setCurrency: (currency: SupportedCurrency) => void;
  /** Switches country and applies its defaults. The locale only follows if the user never picked one. */
  setCountry: (
    country: string,
    defaults?: { currency?: string; locale?: string }
  ) => void;
  t: (key: TranslationKey, vars?: TranslationVars) => string;
  tp: (key: PluralKey, count: number, vars?: TranslationVars) => string;
  formatPrice: (priceInKES: number) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
}

export type I18nStore = StoreApi<I18nState>;

/** Previous localStorage key; read once so existing visitors keep their settings. */
const LEGACY_STORAGE_KEY = "ecommerce-i18n-storage-v2";
const ONE_YEAR = 60 * 60 * 24 * 365;

const cookieStorage: StateStorage = {
  getItem: (name) => {
    if (typeof document === "undefined") return null;
    const prefix = `${name}=`;
    const match = document.cookie.split("; ").find((c) => c.startsWith(prefix));
    if (match) return decodeURIComponent(match.slice(prefix.length));
    try {
      return localStorage.getItem(LEGACY_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // storage unavailable (private mode); the cookie is the source of truth anyway
    }
  },
  removeItem: (name) => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; max-age=0`;
  },
};

export const createI18nStore = (initial: I18nSnapshot) =>
  createStore<I18nState>()(
    persist(
      (set, get) => ({
        ...initial,

        setLocale: (locale) => {
          if (isSupportedLocale(locale)) set({ locale, userChoseLocale: true });
        },

        setCurrency: (currency) => {
          if (isSupportedCurrency(currency)) set({ currency });
        },

        setCountry: (country, defaults) => {
          const next: Partial<I18nSnapshot> = { country };
          if (isSupportedCurrency(defaults?.currency)) next.currency = defaults.currency;
          if (!get().userChoseLocale && isSupportedLocale(defaults?.locale)) {
            next.locale = defaults.locale;
          }
          set(next);
        },

        t: (key, vars) => translate(get().locale, key, vars),
        tp: (key, count, vars) => translatePlural(get().locale, key, count, vars),
        formatPrice: (priceInKES) => formatPriceIn(priceInKES, get().locale, get().currency),
        formatNumber: (value, options) => formatNumberIn(value, get().locale, options),
        formatDate: (value, options) => formatDateIn(value, get().locale, options),
      }),
      {
        name: I18N_COOKIE,
        version: 1,
        storage: createJSONStorage(() => cookieStorage),
        partialize: (state): I18nSnapshot => ({
          locale: state.locale,
          currency: state.currency,
          country: state.country,
          userChoseLocale: state.userChoseLocale,
        }),
        migrate: (persisted) => normalizeI18n(persisted),
        merge: (persisted, current) => ({ ...current, ...normalizeI18n(persisted) }),
        // The provider seeds state from the server-read cookie, then rehydrates after mount.
        // This keeps the first client render identical to the server HTML.
        skipHydration: true,
      }
    )
  );

export const I18nStoreContext = createContext<I18nStore | null>(null);

export function useI18nStore(): I18nState;
export function useI18nStore<T>(selector: (state: I18nState) => T): T;
export function useI18nStore<T>(selector?: (state: I18nState) => T) {
  const store = useContext(I18nStoreContext);
  if (!store) throw new Error("useI18nStore must be used within <I18nProvider>");
  return useStore(store, selector ?? ((state) => state as T));
}
