"use client";

import MainLayout from "../layouts/main/main-layout";
import Link from "next/link";
import { AiOutlinePhone } from "react-icons/ai";
import { WordRotate } from "@/components/ui/word-rotate";
import { cn } from "@/lib/utils";
import { useI18nStore } from "@/lib/i18n/store";
import { CURRENCIES, LOCALES, isSupportedCurrency, isSupportedLocale } from "@/lib/i18n/config";
import { useGetCountries } from "@/features/countries/use-get-countries";

interface NavbarTopProps {
  stickToTop?: boolean;
}

const NavbarTop: React.FC<NavbarTopProps> = ({ stickToTop = false }) => {
  const { locale, setLocale, currency, setCurrency, country, setCountry, t } =
    useI18nStore();
  const { data: countries } = useGetCountries();

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = countries?.find((c) => c.code === e.target.value);
    setCountry(e.target.value, {
      currency: selected?.currency,
      locale: selected?.defaultLocale,
    });
  };

  const regionNames = new Intl.DisplayNames([LOCALES[locale].intl], { type: "region" });

  return (
    <MainLayout className={cn("bg-primary", stickToTop && "sticky top-0 z-50")}>
      <div className="flex justify-between items-center text-white h-10 text-sm">
        <div className="navbar-top-left">
          <Link
            className="flex justify-center items-center gap-x-2 hover:opacity-80 transition-opacity"
            href="tel:+254768133220"
            title="Telephone"
            aria-label="Telephone"
          >
            <AiOutlinePhone className="transform rotate-90 text-yellow-300" />{" "}
            <span className="hidden sm:inline-block font-medium">
              {t("nav.telephone")}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-x-2">
          <div className="hidden md:flex items-center gap-x-2">
            <WordRotate
              className="text-sm font-medium text-white"
              words={[
                "Get 50% off on selected items",
                "Free delivery on orders over $50",
                "Exclusive vouchers for new customers",
                "Buy 1 get 1 free on all accessories",
                "Limited time: 30% off storewide",
                "Sign up and get a $10 discount",
              ]}
            />
            <span>|</span>
          </div>
          <Link
            href="/shop"
            title="Shop"
            aria-label="Shop"
            className="font-semibold underline underline-offset-2 hover:text-yellow-300 transition-colors"
          >
            {t("nav.shopNow")}
          </Link>
        </div>

        <div className="flex justify-between items-center gap-x-2 sm:gap-x-3 text-xs sm:text-sm">
          {/* Country Selector */}
          {countries && countries.length > 0 && (
            <select
              title="Country"
              aria-label="Country"
              value={country}
              onChange={handleCountryChange}
              className="bg-transparent border border-white/30 rounded px-1 py-0.5 outline-none cursor-pointer text-white"
            >
              {countries.map((c) => (
                <option
                  className="text-slate-900 bg-white"
                  value={c.code}
                  key={c.code}
                >
                  {c.flag} {regionNames.of(c.code) ?? c.name}
                </option>
              ))}
            </select>
          )}

          {/* Currency Selector */}
          <select
            title="Currency"
            aria-label="Currency"
            name="currency"
            value={currency}
            onChange={(e) => isSupportedCurrency(e.target.value) && setCurrency(e.target.value)}
            className="bg-transparent border border-white/30 rounded px-1 py-0.5 outline-none cursor-pointer text-white font-medium"
          >
            {Object.values(CURRENCIES).map((item) => (
              <option
                className="text-slate-900 bg-white"
                value={item.code}
                key={item.code}
              >
                {item.code} ({item.symbol})
              </option>
            ))}
          </select>

          {/* Language Selector */}
          <select
            title="Language"
            aria-label="Language"
            name="language"
            value={locale}
            onChange={(e) => isSupportedLocale(e.target.value) && setLocale(e.target.value)}
            className="bg-transparent border border-white/30 rounded px-1 py-0.5 outline-none cursor-pointer text-white font-medium"
          >
            {Object.values(LOCALES).map((item) => (
              <option
                className="text-slate-900 bg-white"
                value={item.code}
                key={item.code}
              >
                {item.nativeName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </MainLayout>
  );
};

export default NavbarTop;
