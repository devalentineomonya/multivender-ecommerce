"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { TbUserCheck } from "react-icons/tb";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/zustand/cart-store";
import { getUserRole, getRoleDashboardPath } from "@/lib/auth/roles";
import { useI18nStore } from "@/lib/i18n/store";
import type { User } from "@supabase/supabase-js";

interface NavbarLeftProps {
  navBarOpen: boolean;
  setNavBarOpen: (isOpen: boolean) => void;
}

const NavbarLeft: React.FC<NavbarLeftProps> = ({ navBarOpen, setNavBarOpen }) => {
  const { t } = useI18nStore();
  const [user, setUser] = useState<User | null>(null);
  const cartItemCount = useCartStore((state) => state.totalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    async function fetchUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
    }

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const role = getUserRole(user);
  const dashboardPath = getRoleDashboardPath(role);

  const profileLink = user
    ? !!user?.identities?.[0]?.identity_data?.email_verified
      ? dashboardPath
      : "/auth/confirm-otp"
    : "/auth/sign-in";

  return (
    <div className="flex justify-center items-center sm:gap-x-5 gap-x-2">
      <Link href={profileLink} title={t("nav.account")} aria-label={t("nav.account")}>
        <div className="flex justify-center items-center gap-x-3 relative ml-1 md:ml-0">
          {user ? (
            <>
              <TbUserCheck size={20} className="text-primary" />
              <span className="hidden capitalize font-medium text-slate-800 lg:inline">
                {user?.user_metadata?.full_name?.split(" ")[0]?.toLowerCase() ||
                  user?.user_metadata?.firstName?.toLowerCase() ||
                  t("nav.account")}
              </span>
            </>
          ) : (
            <>
              <AiOutlineUser size={20} />
              <span className="hidden lg:inline">{t("nav.account")}</span>
            </>
          )}
        </div>
      </Link>

      <Link href="/cart" title={t("nav.cart")} aria-label={t("nav.cart")} className="relative">
        <div className="flex justify-center items-center gap-x-2 relative ml-1 md:ml-0">
          <div className="relative">
            <BsCartPlus size={22} />
            {mounted && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in-50">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </div>
          <span className="hidden font-medium text-slate-800 lg:inline">{t("nav.cart")}</span>
        </div>
      </Link>

      <button
        type="button"
        aria-label={t("nav.menu")}
        aria-expanded={navBarOpen}
        onClick={() => setNavBarOpen(!navBarOpen)}
        className="flex size-9 items-center justify-center lg:hidden"
      >
        <HiOutlineMenuAlt4 size={20} />
      </button>
    </div>
  );
};

export default NavbarLeft;
