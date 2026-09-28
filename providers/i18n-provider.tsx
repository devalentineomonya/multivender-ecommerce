"use client";

import { useEffect, useState } from "react";
import { useStore } from "zustand";
import type { I18nSnapshot } from "@/lib/i18n/config";
import { createI18nStore, I18nStoreContext } from "@/lib/i18n/store";

export function I18nProvider({
  initial,
  children,
}: {
  initial: I18nSnapshot;
  children: React.ReactNode;
}) {
  // One store per request on the server and one per session in the browser,
  // so no locale leaks between concurrent server renders.
  const [store] = useState(() => createI18nStore(initial));
  const locale = useStore(store, (s) => s.locale);

  useEffect(() => {
    // Picks up legacy localStorage settings and writes the cookie going forward.
    store.persist.rehydrate();
  }, [store]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <I18nStoreContext.Provider value={store}>{children}</I18nStoreContext.Provider>;
}
