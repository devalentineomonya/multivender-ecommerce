import { Hono } from "hono";
import type { SupportedCurrency, SupportedLocale } from "@/lib/i18n/config";

/** Currency rates and symbols live in lib/i18n/config.ts; this only maps a country to its defaults. */
export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  /** Countries without a supported local currency fall back to USD. */
  currency: SupportedCurrency;
  phoneCode: string;
  defaultLocale: SupportedLocale;
}

export const COUNTRIES: CountryInfo[] = [
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    currency: "KES",
    phoneCode: "+254",
    defaultLocale: "sw",
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    phoneCode: "+1",
    defaultLocale: "en",
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    phoneCode: "+44",
    defaultLocale: "en",
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    currency: "EUR",
    phoneCode: "+49",
    defaultLocale: "de",
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    currency: "EUR",
    phoneCode: "+33",
    defaultLocale: "fr",
  },
  {
    code: "ES",
    name: "Spain",
    flag: "🇪🇸",
    currency: "EUR",
    phoneCode: "+34",
    defaultLocale: "es",
  },
  {
    code: "UG",
    name: "Uganda",
    flag: "🇺🇬",
    currency: "UGX",
    phoneCode: "+256",
    defaultLocale: "en",
  },
  {
    code: "TZ",
    name: "Tanzania",
    flag: "🇹🇿",
    currency: "TZS",
    phoneCode: "+255",
    defaultLocale: "sw",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    currency: "USD",
    phoneCode: "+1",
    defaultLocale: "en",
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    currency: "USD",
    phoneCode: "+27",
    defaultLocale: "en",
  },
  {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    currency: "USD",
    phoneCode: "+234",
    defaultLocale: "en",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    currency: "USD",
    phoneCode: "+971",
    defaultLocale: "en",
  },
];

const countriesRouter = new Hono()
  .get("/", (c) => {
    const search = c.req.query("search")?.toLowerCase();
    let result = COUNTRIES;
    if (search) {
      result = COUNTRIES.filter(
        (country) =>
          country.name.toLowerCase().includes(search) ||
          country.code.toLowerCase().includes(search) ||
          country.currency.toLowerCase().includes(search)
      );
    }
    return c.json({
      success: true,
      data: result,
      total: result.length,
    });
  })
  .get("/:code", (c) => {
    const code = c.req.param("code").toUpperCase();
    const country = COUNTRIES.find((co) => co.code === code);
    if (!country) {
      return c.json({ success: false, message: "Country not found" }, 404);
    }
    return c.json({ success: true, data: country });
  });

export default countriesRouter;
