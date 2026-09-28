"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next-nprogress-bar";
import { usePathname } from "next/navigation";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useDismiss } from "@/hooks/useDismiss";
import { useGetProducts } from "@/features/products/use-get-products";
import { useGetCategories } from "@/features/categories/use-get-categories";
import { useI18nStore } from "@/lib/i18n/store";
import SearchDropDown, { type SearchOption, type SearchStatus } from "./search-drop-down";

const MIN_QUERY_LENGTH = 2;

function firstImage(images: unknown): string | undefined {
  return Array.isArray(images) && typeof images[0] === "string" ? images[0] : undefined;
}

/** Debounces `rawQuery`, fetches product matches, and filters cached categories client-side. */
function useSearchOptions(rawQuery: string) {
  const { formatPrice } = useI18nStore();
  const query = rawQuery.trim();
  const debouncedQuery = useDebouncedValue(query, 300);
  const enabled = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const { data: categoriesData } = useGetCategories();
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetProducts({ search: debouncedQuery, limit: 6 }, { enabled });

  const categories: SearchOption[] = enabled
    ? (categoriesData ?? [])
        .filter((c) => c.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
        .slice(0, 4)
        .map((c) => ({
          type: "category" as const,
          id: c.id,
          href: `/shop?category=${encodeURIComponent(c.id)}`,
          label: c.name,
        }))
    : [];

  const products: SearchOption[] = enabled
    ? (data?.products ?? []).map((p) => ({
        type: "product" as const,
        id: p.id,
        href: `/product/${p.id}`,
        label: p.name,
        image: firstImage(p.images),
        priceLabel: formatPrice(p.price),
      }))
    : [];

  const options = [...categories, ...products];

  let status: SearchStatus;
  if (!enabled) status = "hint";
  else if (isLoading) status = "loading";
  else if (isError) status = "error";
  else if (options.length === 0) status = "empty";
  else status = "success";

  return { status, options, debouncedQuery, retry: refetch };
}

interface ShellProps {
  isMenuActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

/** Shared combobox behavior: value, keyboard nav, dismissal. Each shell renders its own chrome. */
function useSearchCombobox({ isMenuActive, onActivate, onDeactivate }: ShellProps) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const pathname = usePathname();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const { status, options, debouncedQuery, retry } = useSearchOptions(value);

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
    onDeactivate();
  };

  const openPanel = () => {
    setOpen(true);
    onActivate();
  };

  // Another menu (category dropdown, mobile drawer) became active: close this one.
  useEffect(() => {
    if (!isMenuActive && open) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuActive]);

  // Route change, window blur, or tab hidden all dismiss the panel.
  useEffect(() => {
    if (!open) return;
    const onBlur = () => close();
    const onVisibility = () => { if (document.hidden) close(); };
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useDismiss([rootRef], close, { enabled: open });

  const navigate = (href: string) => {
    close();
    setValue("");
    router.push(href);
  };

  const submitRaw = () => {
    const q = value.trim();
    if (!q) return;
    navigate(`/shop?search=${encodeURIComponent(q)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) { openPanel(); return; }
        setActiveIndex((i) => (options.length ? (i + 1) % options.length : -1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) { openPanel(); return; }
        setActiveIndex((i) => (options.length ? (i - 1 + options.length) % options.length : -1));
        break;
      case "Home":
        if (open && options.length) { e.preventDefault(); setActiveIndex(0); }
        break;
      case "End":
        if (open && options.length) { e.preventDefault(); setActiveIndex(options.length - 1); }
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) navigate(options[activeIndex].href);
        else submitRaw();
        break;
      case "Escape":
        if (open) { e.preventDefault(); close(); }
        else if (value) setValue("");
        break;
      case "Tab":
        close();
        break;
      case "Backspace":
        if (value === "") close();
        break;
    }
  };

  const getOptionId = (index: number) => `${listboxId}-opt-${index}`;

  return {
    value,
    setValue,
    open,
    openPanel,
    close,
    activeIndex,
    setActiveIndex,
    listboxId,
    getOptionId,
    rootRef,
    status,
    options,
    debouncedQuery,
    retry,
    onKeyDown,
    navigate,
    submitRaw,
  };
}

function DesktopSearch(props: ShellProps) {
  const { t } = useI18nStore();
  const c = useSearchCombobox(props);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div ref={c.rootRef} className="relative hidden w-full max-w-md lg:block">
      <form
        role="search"
        onSubmit={(e) => { e.preventDefault(); c.submitRaw(); }}
        className="flex items-center gap-x-2 rounded-full border border-gray-200 px-3 py-1.5 text-gray-500 focus-within:border-primary"
      >
        <label htmlFor="navbar-search-input" className="sr-only">
          {t("search.label")}
        </label>
        <input
          ref={inputRef}
          id="navbar-search-input"
          role="combobox"
          aria-expanded={c.open}
          aria-controls={c.listboxId}
          aria-autocomplete="list"
          aria-activedescendant={c.activeIndex >= 0 ? c.getOptionId(c.activeIndex) : undefined}
          type="search"
          autoComplete="off"
          value={c.value}
          onChange={(e) => c.setValue(e.target.value)}
          onFocus={c.openPanel}
          onKeyDown={c.onKeyDown}
          placeholder={t("search.placeholder")}
          className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-gray-400"
        />
        <button type="submit" aria-label={t("search.submit")} className="shrink-0 text-gray-500 hover:text-primary">
          <AiOutlineSearch size={18} />
        </button>
      </form>

      {c.open && (
        <div className="absolute left-0 right-0 top-full z-(--z-dropdown) mt-2 max-h-[min(70vh,520px)] overflow-y-auto rounded-panel border border-gray-100 bg-white shadow-pop">
          <SearchDropDown
            listboxId={c.listboxId}
            status={c.status}
            query={c.debouncedQuery}
            options={c.options}
            activeIndex={c.activeIndex}
            getOptionId={c.getOptionId}
            onHover={c.setActiveIndex}
            onSelect={(opt) => c.navigate(opt.href)}
            onRetry={c.retry}
          />
        </div>
      )}
    </div>
  );
}

function MobileSearch(props: ShellProps) {
  const { t } = useI18nStore();
  const c = useSearchCombobox(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!c.open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [c.open]);

  const onAnimationComplete = () => inputRef.current?.focus();

  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const container = c.rootRef.current;
    if (!container) return;
    const focusables = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={t("search.open")}
        onClick={c.openPanel}
        className="flex size-9 items-center justify-center"
      >
        <AiOutlineSearch size={20} />
      </button>

      <AnimatePresence>
        {c.open && (
          <motion.div
            ref={c.rootRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("search.label")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={onAnimationComplete}
            onKeyDown={trapTab}
            className="fixed inset-0 z-(--z-overlay) flex h-dvh flex-col bg-white pb-[env(safe-area-inset-bottom)]"
          >
            <form
              role="search"
              onSubmit={(e) => { e.preventDefault(); c.submitRaw(); }}
              className="flex items-center gap-2 border-b border-gray-100 p-3"
            >
              <button type="button" aria-label={t("search.back")} onClick={c.close} className="shrink-0 p-1">
                <BiArrowBack size={20} />
              </button>
              <label htmlFor="mobile-search-input" className="sr-only">
                {t("search.label")}
              </label>
              <input
                ref={inputRef}
                id="mobile-search-input"
                role="combobox"
                aria-expanded={c.open}
                aria-controls={c.listboxId}
                aria-autocomplete="list"
                aria-activedescendant={c.activeIndex >= 0 ? c.getOptionId(c.activeIndex) : undefined}
                type="search"
                autoComplete="off"
                value={c.value}
                onChange={(e) => c.setValue(e.target.value)}
                onKeyDown={c.onKeyDown}
                placeholder={t("search.placeholder")}
                // 16px min font-size prevents iOS Safari from zooming in on focus
                className="min-w-0 flex-1 border-none bg-transparent text-base text-slate-700 outline-none placeholder:text-gray-400"
              />
              {c.value && (
                <button type="button" aria-label={t("search.clear")} onClick={() => c.setValue("")} className="shrink-0 p-1 text-gray-400">
                  <AiOutlineClose size={16} />
                </button>
              )}
            </form>
            <div className="flex-1 overflow-y-auto">
              <SearchDropDown
                listboxId={c.listboxId}
                status={c.status}
                query={c.debouncedQuery}
                options={c.options}
                activeIndex={c.activeIndex}
                getOptionId={c.getOptionId}
                onHover={c.setActiveIndex}
                onSelect={(opt) => c.navigate(opt.href)}
                onRetry={c.retry}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Renders both a desktop inline combobox and a mobile full-screen overlay; only one is ever visible per viewport. */
const NavbarSearch: React.FC<ShellProps> = (props) => {
  return (
    <>
      <DesktopSearch {...props} />
      <MobileSearch {...props} />
    </>
  );
};

export default NavbarSearch;
