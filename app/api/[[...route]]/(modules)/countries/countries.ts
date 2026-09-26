import { Hono } from "hono";

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  defaultLocale: string;
  exchangeRateToUSD: number; // 1 USD in this currency
}

export const COUNTRIES: CountryInfo[] = [
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    currency: "KES",
    currencySymbol: "KSh",
    phoneCode: "+254",
    defaultLocale: "sw",
    exchangeRateToUSD: 130,
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
    phoneCode: "+1",
    defaultLocale: "en",
    exchangeRateToUSD: 1,
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "£",
    phoneCode: "+44",
    defaultLocale: "en",
    exchangeRateToUSD: 0.79,
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    currency: "EUR",
    currencySymbol: "€",
    phoneCode: "+49",
    defaultLocale: "de",
    exchangeRateToUSD: 0.92,
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    currency: "EUR",
    currencySymbol: "€",
    phoneCode: "+33",
    defaultLocale: "fr",
    exchangeRateToUSD: 0.92,
  },
  {
    code: "ES",
    name: "Spain",
    flag: "🇪🇸",
    currency: "EUR",
    currencySymbol: "€",
    phoneCode: "+34",
    defaultLocale: "es",
    exchangeRateToUSD: 0.92,
  },
  {
    code: "UG",
    name: "Uganda",
    flag: "🇺🇬",
    currency: "UGX",
    currencySymbol: "USh",
    phoneCode: "+256",
    defaultLocale: "en",
    exchangeRateToUSD: 3700,
  },
  {
    code: "TZ",
    name: "Tanzania",
    flag: "🇹🇿",
    currency: "TSH",
    currencySymbol: "TSh",
    phoneCode: "+255",
    defaultLocale: "sw",
    exchangeRateToUSD: 2600,
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    currency: "USD",
    currencySymbol: "CA$",
    phoneCode: "+1",
    defaultLocale: "en",
    exchangeRateToUSD: 1.36,
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    currency: "USD",
    currencySymbol: "R",
    phoneCode: "+27",
    defaultLocale: "en",
    exchangeRateToUSD: 18.2,
  },
  {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    currency: "USD",
    currencySymbol: "₦",
    phoneCode: "+234",
    defaultLocale: "en",
    exchangeRateToUSD: 1450,
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    currency: "USD",
    currencySymbol: "AED",
    phoneCode: "+971",
    defaultLocale: "en",
    exchangeRateToUSD: 3.67,
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
