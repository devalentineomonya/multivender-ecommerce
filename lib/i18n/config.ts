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
  rateFromKES: number; // 1 KES = rateFromKES
}

export const LOCALES: Record<SupportedLocale, LocaleInfo> = {
  en: { code: "en", name: "English", nativeName: "English", flag: "🇰🇪" },
  sw: { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  fr: { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  de: { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  es: { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
};

export const CURRENCIES: Record<SupportedCurrency, CurrencyInfo> = {
  KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", rateFromKES: 1 },
  USD: { code: "USD", symbol: "$", name: "US Dollar", rateFromKES: 1 / 130 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rateFromKES: 0.92 / 130 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rateFromKES: 0.79 / 130 },
  UGX: { code: "UGX", symbol: "USh", name: "Ugandan Shilling", rateFromKES: 3700 / 130 },
  TSH: { code: "TSH", symbol: "TSh", name: "Tanzanian Shilling", rateFromKES: 2600 / 130 },
};

export const DEFAULT_LOCALE: SupportedLocale = "en";
export const DEFAULT_CURRENCY: SupportedCurrency = "KES";
