"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { useI18nStore } from "@/lib/i18n/store";
import { cn } from "@/lib/utils";
import type { NavItem } from "./navbaritems";

interface NavItemsProps {
  navItems: NavItem[];
  /** "desktop": inline horizontal row with an underline indicator. "drawer": stacked, ≥44px touch targets. */
  variant?: "desktop" | "drawer";
  /** Called after navigating — the drawer uses this to close itself. */
  onNavigate?: () => void;
}

function isActive(item: NavItem, pathname: string, label: string | null) {
  if (item.href === "/") return pathname === "/";
  if (item.titleKey === "nav.whatIsNew") return pathname === "/shop" && label === "New";
  const hrefPath = item.href.split("?")[0];
  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
}

const NavItems: React.FC<NavItemsProps> = ({ navItems, variant = "desktop", onNavigate }) => {
  const { t } = useI18nStore();
  const pathname = usePathname();
  const [label] = useQueryState("label", parseAsString);

  return (
    <ul
      className={
        variant === "desktop"
          ? "hidden items-center gap-x-8 lg:flex"
          : "flex flex-col gap-y-1"
      }
    >
      {navItems.map((item, i) => {
        const active = isActive(item, pathname, label);
        return (
          <li
            key={item.key}
            style={variant === "drawer" ? ({ "--i": i } as React.CSSProperties) : undefined}
            className={variant === "drawer" ? "drawer-stagger motion-safe:fill-mode-both motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-2" : undefined}
          >
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center transition-colors hover:text-primary",
                variant === "desktop"
                  ? cn(
                      "whitespace-nowrap py-2 text-gray-600 before:absolute before:bottom-0 before:h-0.5 before:w-0 before:bg-primary before:transition-[width] before:duration-300 before:ease-smooth hover:before:w-full",
                      active && "text-primary before:w-full"
                    )
                  : cn(
                      "min-h-11 w-full rounded-md px-3 py-2.5 text-base text-gray-700",
                      active && "bg-primary/10 font-semibold text-primary"
                    )
              )}
            >
              {t(item.titleKey)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
