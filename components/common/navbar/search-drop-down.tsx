"use client";

import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { useI18nStore } from "@/lib/i18n/store";

export interface SearchOption {
  type: "category" | "product";
  id: string;
  href: string;
  label: string;
  sublabel?: string;
  image?: string;
  priceLabel?: string;
}

export type SearchStatus = "hint" | "loading" | "success" | "empty" | "error";

interface SearchDropDownProps {
  listboxId: string;
  status: SearchStatus;
  query: string;
  options: SearchOption[];
  activeIndex: number;
  getOptionId: (index: number) => string;
  onHover: (index: number) => void;
  onSelect: (option: SearchOption) => void;
  onRetry: () => void;
}

/** Escapes a query before it is used to build a RegExp for match-highlighting. */
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "i"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="rounded-sm bg-primary/15 text-inherit">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const SKELETON_ROW_HEIGHT = "h-14";

export default function SearchDropDown({
  listboxId,
  status,
  query,
  options,
  activeIndex,
  getOptionId,
  onHover,
  onSelect,
  onRetry,
}: SearchDropDownProps) {
  const { t, formatPrice, tp } = useI18nStore();

  if (status === "hint") {
    return (
      <div className="px-4 py-6 text-sm text-gray-500" role="status">
        {t("search.hint")}
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 ${SKELETON_ROW_HEIGHT} animate-pulse`}>
            <div className="size-10 shrink-0 rounded-md bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/3 rounded-sm bg-gray-100" />
              <div className="h-2.5 w-1/3 rounded-sm bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
        <BiErrorCircle className="size-6 text-gray-400" />
        <p className="text-sm text-gray-600">{t("search.error")}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
        >
          {t("search.retry")}
        </button>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
        <AiOutlineSearch className="size-6 text-gray-300" />
        <p className="text-sm text-gray-600">{t("search.empty", { query })}</p>
      </div>
    );
  }

  const categories = options.filter((o) => o.type === "category");
  const products = options.filter((o) => o.type === "product");

  return (
    <ul id={listboxId} role="listbox" aria-label={t("search.label")} className="py-2">
      <li aria-hidden="true" className="sr-only">
        {tp("search.resultsCount", options.length)}
      </li>

      {categories.length > 0 && (
        <>
          <li
            aria-hidden="true"
            className="sticky top-0 z-10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400"
          >
            {t("search.categoriesHeading")}
          </li>
          {categories.map((opt) => {
            const index = options.indexOf(opt);
            return (
              <SearchRow
                key={opt.id + opt.type}
                option={opt}
                query={query}
                active={index === activeIndex}
                id={getOptionId(index)}
                onMouseEnter={() => onHover(index)}
                onClick={() => onSelect(opt)}
              />
            );
          })}
        </>
      )}

      {products.length > 0 && (
        <>
          <li
            aria-hidden="true"
            className="sticky top-0 z-10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400"
          >
            {t("search.productsHeading")}
          </li>
          {products.map((opt) => {
            const index = options.indexOf(opt);
            return (
              <SearchRow
                key={opt.id + opt.type}
                option={opt}
                query={query}
                active={index === activeIndex}
                id={getOptionId(index)}
                onMouseEnter={() => onHover(index)}
                onClick={() => onSelect(opt)}
              />
            );
          })}
        </>
      )}

      <li className="mt-1 border-t border-gray-100 px-4 pt-2">
        <a
          href={`/shop?search=${encodeURIComponent(query)}`}
          onClick={(e) => {
            e.preventDefault();
            onSelect({ type: "product", id: "__see_all__", href: `/shop?search=${encodeURIComponent(query)}`, label: query });
          }}
          className="block py-2 text-sm font-medium text-primary hover:underline"
        >
          {t("search.seeAll", { query })}
        </a>
      </li>
    </ul>
  );
}

function SearchRow({
  option,
  query,
  active,
  id,
  onMouseEnter,
  onClick,
}: {
  option: SearchOption;
  query: string;
  active: boolean;
  id: string;
  onMouseEnter: () => void;
  onClick: () => void;
}) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={active}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 px-4 py-2 ${active ? "bg-gray-50" : ""}`}
    >
      {option.type === "product" ? (
        <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-gray-50">
          {option.image && (
            <Image src={option.image} alt="" fill sizes="40px" className="object-contain p-1" />
          )}
        </span>
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gray-50 text-gray-400">
          <AiOutlineSearch className="size-4" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-gray-800">
          <Highlighted text={option.label} query={query} />
        </span>
        {option.sublabel && <span className="block truncate text-xs text-gray-400">{option.sublabel}</span>}
      </span>
      {option.priceLabel && (
        <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">{option.priceLabel}</span>
      )}
    </li>
  );
}
