export type SupportedLocale = "en" | "fr" | "de" | "es" | "sw";
export type SupportedCurrency = "KES" | "USD" | "EUR" | "GBP" | "UGX" | "TZS";

export interface LocaleInfo {
  code: SupportedLocale;
  /** BCP 47 tag passed to Intl formatters */
  intl: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateFromKES: number; // 1 KES = rateFromKES
  decimals: 0 | 2;
}

export const LOCALES: Record<SupportedLocale, LocaleInfo> = {
  en: { code: "en", intl: "en-KE", name: "English", nativeName: "English", flag: "🇰🇪" },
  sw: { code: "sw", intl: "sw-KE", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  fr: { code: "fr", intl: "fr-FR", name: "French", nativeName: "Français", flag: "🇫🇷" },
  de: { code: "de", intl: "de-DE", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  es: { code: "es", intl: "es-ES", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
};

export const CURRENCIES: Record<SupportedCurrency, CurrencyInfo> = {
  KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", rateFromKES: 1, decimals: 0 },
  USD: { code: "USD", symbol: "$", name: "US Dollar", rateFromKES: 1 / 130, decimals: 2 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rateFromKES: 0.92 / 130, decimals: 2 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rateFromKES: 0.79 / 130, decimals: 2 },
  UGX: { code: "UGX", symbol: "USh", name: "Ugandan Shilling", rateFromKES: 3700 / 130, decimals: 0 },
  TZS: { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling", rateFromKES: 2600 / 130, decimals: 0 },
};

export const DEFAULT_LOCALE: SupportedLocale = "en";
export const DEFAULT_CURRENCY: SupportedCurrency = "KES";
export const DEFAULT_COUNTRY = "KE";

/** Cookie holding the persisted i18n state; readable by the server for first paint. */
export const I18N_COOKIE = "i18n";

export interface I18nSnapshot {
  locale: SupportedLocale;
  currency: SupportedCurrency;
  country: string;
  userChoseLocale: boolean;
}

export const DEFAULT_I18N: I18nSnapshot = {
  locale: DEFAULT_LOCALE,
  currency: DEFAULT_CURRENCY,
  country: DEFAULT_COUNTRY,
  userChoseLocale: false,
};

export const isSupportedLocale = (v: unknown): v is SupportedLocale =>
  typeof v === "string" && v in LOCALES;

export const isSupportedCurrency = (v: unknown): v is SupportedCurrency =>
  typeof v === "string" && v in CURRENCIES;

/** Coerce untrusted persisted state (cookie, legacy storage) into a valid snapshot. */
export function normalizeI18n(raw: unknown): I18nSnapshot {
  const s = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  // "TSH" was the pre-ISO code for the Tanzanian shilling
  const currency = s.currency === "TSH" ? "TZS" : s.currency;
  return {
    locale: isSupportedLocale(s.locale) ? s.locale : DEFAULT_I18N.locale,
    currency: isSupportedCurrency(currency) ? currency : DEFAULT_I18N.currency,
    country: typeof s.country === "string" && s.country ? s.country : DEFAULT_I18N.country,
    userChoseLocale: s.userChoseLocale === true,
  };
}

const numberFormatCache = new Map<string, Intl.NumberFormat>();

function getNumberFormat(intl: string, options: Intl.NumberFormatOptions) {
  const key = intl + JSON.stringify(options);
  let fmt = numberFormatCache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(intl, options);
    numberFormatCache.set(key, fmt);
  }
  return fmt;
}

/** Converts a KES amount into `currency` and formats it for `locale`. */
export function formatPriceIn(priceInKES: number, locale: SupportedLocale, currency: SupportedCurrency) {
  const info = CURRENCIES[currency] ?? CURRENCIES[DEFAULT_CURRENCY];
  const amount = Number.isFinite(priceInKES) ? priceInKES * info.rateFromKES : 0;
  return getNumberFormat(LOCALES[locale].intl, {
    style: "currency",
    currency: info.code,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals,
  }).format(amount);
}

export function formatNumberIn(value: number, locale: SupportedLocale, options: Intl.NumberFormatOptions = {}) {
  return getNumberFormat(LOCALES[locale].intl, options).format(value);
}

export function formatDateIn(
  value: Date | string | number,
  locale: SupportedLocale,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
) {
  return new Intl.DateTimeFormat(LOCALES[locale].intl, options).format(new Date(value));
}
