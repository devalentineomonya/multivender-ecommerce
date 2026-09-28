"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { BsChevronDown } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/features/categories/use-get-categories";
import { useI18nStore } from "@/lib/i18n/store";
import { useDismiss } from "@/hooks/useDismiss";

interface NavCategoryDropDownProps {
  showDropDown: boolean;
  setShowDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CategoryItemProps {
  id: string;
  image?: string | null;
  name: string;
  count: number;
  onClick?: () => void;
  linkRef?: React.Ref<HTMLAnchorElement>;
}

const HOVER_OPEN_DELAY = 100;
const HOVER_CLOSE_DELAY = 200;

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const dropdownVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
  closed: { opacity: 0, y: -4, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } },
};

const NavCategoryDropDown: React.FC<NavCategoryDropDownProps> = ({
  showDropDown,
  setShowDropDown,
}) => {
  const { data: categories, isLoading } = useGetCategories();
  const { t } = useI18nStore();
  const pathname = usePathname();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);

  const close = useCallback(() => setShowDropDown(false), [setShowDropDown]);

  // Outside click closes; Escape is handled separately below so we can also restore focus.
  useDismiss([wrapperRef], close, { enabled: showDropDown, closeOnEscape: false });

  // Only one menu is open app-wide: whatever set `showDropDown` false (search, mobile drawer,
  // or this component) already handles that via the parent's single openMenu state.
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    return () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!canHover()) return;
    window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => setShowDropDown(true), HOVER_OPEN_DELAY);
  };

  const handleMouseLeave = () => {
    if (!canHover()) return;
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setShowDropDown(false), HOVER_CLOSE_DELAY);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setShowDropDown(true);
      requestAnimationFrame(() => firstLinkRef.current?.focus());
    }
  };

  // On the wrapper (not just the trigger) so Escape works with focus anywhere inside the panel.
  const handleWrapperKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && showDropDown) {
      e.preventDefault();
      close();
      triggerRef.current?.focus();
    }
  };

  const handleFocusOut = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      close();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative hidden lg:flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlur={handleFocusOut}
      onKeyDown={handleWrapperKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={showDropDown}
        aria-haspopup="true"
        aria-controls="category-dropdown-panel"
        onClick={() => setShowDropDown((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className="flex items-center justify-center gap-x-1 whitespace-nowrap text-gray-600 transition-colors hover:text-primary max-xl:text-xl"
      >
        {t("nav.categories")}
        <BsChevronDown
          className={cn("transition-transform duration-200 ease-smooth", showDropDown && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {showDropDown && (
          <motion.div
            id="category-dropdown-panel"
            role="region"
            aria-label={t("products.topCategories")}
            className="absolute left-0 top-full z-(--z-dropdown) mt-2 w-full min-w-[700px] rounded-panel border border-gray-100 bg-white p-5 shadow-pop"
            initial="closed"
            animate="open"
            exit="closed"
            variants={dropdownVariants}
          >
            <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-3 text-lg font-bold text-gray-800">
              <span>{t("products.topCategories")}</span>
              <Link
                href="/categories"
                className="text-xs font-medium text-primary hover:underline"
                onClick={close}
              >
                {t("nav.viewAll")}
              </Link>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex h-16 w-full animate-pulse items-center gap-x-3 rounded-md bg-gray-100 p-2">
                    <div className="h-14 w-14 shrink-0 rounded-md bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded-sm bg-gray-200" />
                      <div className="h-3 w-1/2 rounded-sm bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="grid max-h-[380px] grid-cols-2 gap-3 overflow-y-auto pr-1 md:grid-cols-3">
                {categories.map((category, i) => (
                  <CategoryItem
                    key={category.id}
                    id={category.id}
                    image={category.imageUrl}
                    name={category.name}
                    count={category.productCount || 0}
                    onClick={close}
                    linkRef={i === 0 ? firstLinkRef : undefined}
                  />
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">{t("nav.noCategories")}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryItem: React.FC<CategoryItemProps> = ({ id, image, name, count, onClick, linkRef }) => {
  const { t } = useI18nStore();
  const placeholderImg = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150&auto=format&fit=crop&q=80";

  return (
    <Link
      ref={linkRef}
      href={`/shop?category=${encodeURIComponent(id)}`}
      aria-label={name}
      onClick={onClick}
      className="flex min-h-16 items-center justify-start gap-x-3 rounded-md border border-gray-100 bg-gray-50 p-2 pl-3 transition-colors hover:border-primary/30 hover:bg-gray-100"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
        <Image src={image || placeholderImg} alt="" fill sizes="56px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <h6 className="truncate text-sm font-semibold text-gray-800">{name}</h6>
        <p className="text-xs text-gray-500">
          {count} {t("products.itemsAvailable")}
        </p>
      </div>
    </Link>
  );
};

export default NavCategoryDropDown;
