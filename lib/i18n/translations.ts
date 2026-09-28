import { DEFAULT_LOCALE, LOCALES, SupportedLocale } from "./config";
import { en, type TranslationKey } from "./translations/en";
import { fr } from "./translations/fr";
import { de } from "./translations/de";
import { es } from "./translations/es";
import { sw } from "./translations/sw";

export type { TranslationKey };

/** `en` is the source of truth; other locales may be partial and fall back to it. */
export const translations: Record<SupportedLocale, Partial<Record<TranslationKey, string>>> = {
  en,
  fr,
  de,
  es,
  sw,
};

export type TranslationVars = Record<string, string | number>;

/** Base keys that have `.one` / `.other` plural variants, e.g. "cart.itemCount". */
export type PluralKey = {
  [K in TranslationKey]: K extends `${infer Base}.other` ? Base : never;
}[TranslationKey];

function interpolate(template: string, vars?: TranslationVars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

export function translate(locale: SupportedLocale, key: TranslationKey, vars?: TranslationVars) {
  const template = translations[locale]?.[key] ?? translations[DEFAULT_LOCALE][key] ?? key;
  return interpolate(template, vars);
}

const pluralRulesCache = new Map<SupportedLocale, Intl.PluralRules>();

/** Picks `${key}.one` / `${key}.other` (or another CLDR category if present) and injects `{count}`. */
export function translatePlural(
  locale: SupportedLocale,
  key: PluralKey,
  count: number,
  vars?: TranslationVars
) {
  let rules = pluralRulesCache.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(LOCALES[locale].intl);
    pluralRulesCache.set(locale, rules);
  }
  const category = rules.select(count);
  const specific = `${key}.${category}` as TranslationKey;
  const hasCategory = (translations[locale]?.[specific] ?? translations[DEFAULT_LOCALE][specific]) !== undefined;
  const chosen = hasCategory ? specific : (`${key}.other` as TranslationKey);
  return translate(locale, chosen, { count, ...vars });
}
