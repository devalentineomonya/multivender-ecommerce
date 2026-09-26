"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineUser, AiOutlineSearch } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { TbUserCheck } from "react-icons/tb";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/zustand/cart-store";
import { getUserRole, getRoleDashboardPath } from "@/lib/auth/roles";
import type { User } from "@supabase/supabase-js";

interface NavbarLeftProps {
  isMobile: boolean;
  setSearching: React.Dispatch<React.SetStateAction<boolean>>;
  searching: boolean;
  setNavBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearchRedirect: () => void;
  handleSearchValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue: string;
}

const NavbarLeft: React.FC<NavbarLeftProps> = ({
  isMobile,
  setSearching,
  searching,
  setNavBarOpen,
  handleSearchRedirect,
  handleSearchValueChange,
  searchValue,
}) => {
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
      <div
        className={`flex justify-center items-center gap-x-3 relative ml-1 md:ml-0 ${
          !isMobile ? "hidden" : ""
        }`}
        onClick={() => setSearching((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSearching((prev) => !prev);
          }
        }}
      >
        <AiOutlineSearch size={20} />
        {searching && (
          <div
            className={`${
              isMobile
                ? "fixed md:absolute bg-white rounded-lg mt-32 right-0 px-5 py-5 w-[98%] mr-[1%] md:mr-[0%] md:w-[calc(100vw-200px)] flex justify-center items-center z-30 shadow-[3px_3px_16.5px_-7.5px_#ccc6c6]"
                : ""
            }`}
          >
            <input
              autoFocus
              onChange={handleSearchValueChange}
              value={searchValue}
              className={`border-none w-full outline-none ${
                searching ? "inline-block" : "hidden"
              }`}
              type="text"
              placeholder="Search Product"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setSearching(false);
                  handleSearchRedirect();
                }
              }}
            />
            <div
              className="rounded-full hover:bg-gray-200 min-h-7 min-w-7 max-h-7 max-w-7 flex justify-center items-center cursor-pointer"
              onClick={handleSearchRedirect}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchRedirect();
                }
              }}
            >
              <AiOutlineSearch size={20} />
            </div>
          </div>
        )}
      </div>

      <Link href={profileLink} title="Profile" aria-label="Profile">
        <div className="flex justify-center items-center gap-x-3 relative ml-1 md:ml-0">
          {user ? (
            <>
              <TbUserCheck size={20} className="text-primary" />
              {!isMobile && (
                <span className="capitalize font-medium text-slate-800">
                  {user?.user_metadata?.full_name?.split(" ")[0]?.toLowerCase() ||
                    user?.user_metadata?.firstName?.toLowerCase() ||
                    "Account"}
                </span>
              )}
            </>
          ) : (
            <>
              <AiOutlineUser size={20} />
              {!isMobile && "Account"}
            </>
          )}
        </div>
      </Link>

      <Link href="/cart" title="Cart" aria-label="Cart" className="relative">
        <div className="flex justify-center items-center gap-x-2 relative ml-1 md:ml-0">
          <div className="relative">
            <BsCartPlus size={22} />
            {mounted && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in-50">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </div>
          {!isMobile && <span className="font-medium text-slate-800">Cart</span>}
        </div>
      </Link>

      <div
        className={`flex justify-center items-center gap-x-3 relative ml-1 md:ml-0 ${
          !isMobile ? "hidden" : ""
        }`}
        onClick={() => setNavBarOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setNavBarOpen(true);
          }
        }}
      >
        <HiOutlineMenuAlt4 size={20} />
      </div>
    </div>
  );
};

export default NavbarLeft;
