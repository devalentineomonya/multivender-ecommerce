export type SupportedLocale = "en" | "fr" | "de" | "es" | "sw";
export type SupportedCurrency = "KES" | "USD" | "EUR" | "GBP" | "UGX" | "TSH";

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
}

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = rateToUSD
}

export const LOCALES: Record<SupportedLocale, LocaleInfo> = {
  en: { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  fr: { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  de: { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  es: { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  sw: { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
};

export const CURRENCIES: Record<SupportedCurrency, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", rateToUSD: 1 },
  KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", rateToUSD: 130 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rateToUSD: 0.92 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rateToUSD: 0.79 },
  UGX: { code: "UGX", symbol: "USh", name: "Ugandan Shilling", rateToUSD: 3700 },
  TSH: { code: "TSH", symbol: "TSh", name: "Tanzanian Shilling", rateToUSD: 2600 },
};

export const DEFAULT_LOCALE: SupportedLocale = "en";
export const DEFAULT_CURRENCY: SupportedCurrency = "USD";
