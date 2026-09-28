"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { BsX } from "react-icons/bs";
import Link from "next/link";
import { Dialog, DialogPortal, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { useGetCategories } from "@/features/categories/use-get-categories";
import { useI18nStore } from "@/lib/i18n/store";
import NavItems from "./nav-items";
import navItems from "./navbaritems";

interface NavbarMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * A left-side drawer built on Radix Dialog, which supplies the focus trap, focus
 * restore, body scroll lock and Escape/overlay-click dismissal for free. Also
 * surfaces the category list, which was otherwise unreachable below the lg breakpoint.
 */
const NavbarMobile: React.FC<NavbarMobileProps> = ({ open, onOpenChange }) => {
  const { t } = useI18nStore();
  const { data: categories } = useGetCategories();
  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="lg:hidden" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 left-0 z-(--z-overlay) flex h-dvh w-[85%] max-w-xs flex-col overflow-y-auto bg-white pb-[env(safe-area-inset-bottom)] shadow-pop duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left lg:hidden"
        >
          <DialogTitle className="sr-only">{t("nav.menu")}</DialogTitle>

          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <span className="text-sm font-semibold text-gray-800">{t("nav.menu")}</span>
            <DialogPrimitive.Close
              aria-label={t("nav.closeMenu")}
              className="flex size-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            >
              <BsX size={22} />
            </DialogPrimitive.Close>
          </div>

          <nav className="flex-1 p-4">
            <NavItems navItems={navItems} variant="drawer" onNavigate={close} />

            {categories && categories.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-4">
                <h3 className="px-3 pb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                  {t("nav.categories")}
                </h3>
                <ul className="flex flex-col gap-y-1">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/shop?category=${encodeURIComponent(category.id)}`}
                        onClick={close}
                        className="block min-h-11 truncate rounded-md px-3 py-2.5 text-base text-gray-700 hover:bg-gray-50"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default NavbarMobile;
