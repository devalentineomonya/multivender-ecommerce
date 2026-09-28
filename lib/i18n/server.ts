import { cookies } from "next/headers";
import { I18N_COOKIE, I18nSnapshot, formatPriceIn, normalizeI18n, DEFAULT_I18N } from "./config";
import { translate, type TranslationKey, type TranslationVars } from "./translations";

function parseCookie(value: string): unknown {
  for (const candidate of [value, safeDecode(value)]) {
    try {
      return JSON.parse(candidate);
    } catch {
      // try the next encoding
    }
  }
  return null;
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Reads the persisted i18n cookie (zustand persist shape: `{ state, version }`). */
export async function getServerI18n(): Promise<I18nSnapshot> {
  const raw = (await cookies()).get(I18N_COOKIE)?.value;
  if (!raw) return DEFAULT_I18N;
  const parsed = parseCookie(raw) as { state?: unknown } | null;
  return normalizeI18n(parsed?.state);
}

/** Server-side translator bound to the request's locale, for metadata and server components. */
export async function getServerTranslator() {
  const i18n = await getServerI18n();
  return {
    ...i18n,
    t: (key: TranslationKey, vars?: TranslationVars) => translate(i18n.locale, key, vars),
    formatPrice: (priceInKES: number) => formatPriceIn(priceInKES, i18n.locale, i18n.currency),
  };
}
