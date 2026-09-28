"use client"
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import MainLayout from "../layouts/main/main-layout";
import navItems from "./navbaritems";
import NavbarLogo from "./navbar-logo";
import NavItems from "./nav-items";
import NavbarSearch from "./navbar-search";
import NavbarLeft from "./navbar-left";
import NavbarMobile from "./navbar-mobile";
import NavCategoryDropDown from "./nav-category-drop-down";
import OneTap from "./one-tap";

/** At most one of these is open at a time, app-wide. */
type OpenMenu = "category" | "search" | "mobile" | null;

const NavbarLower: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const pathname = usePathname();

  // Whatever is open, a navigation always closes it.
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  // Compatibility shim: NavCategoryDropDown still takes a useState-shaped pair.
  const showCategoryDropDown = openMenu === "category";
  const setShowCategoryDropDown: React.Dispatch<React.SetStateAction<boolean>> = useCallback((value) => {
    setOpenMenu((prev) => {
      const next = typeof value === "function" ? (value as (p: boolean) => boolean)(prev === "category") : value;
      return next ? "category" : null;
    });
  }, []);

  const mobileNavOpen = openMenu === "mobile";
  const setMobileNavOpen = useCallback((isOpen: boolean) => {
    setOpenMenu(isOpen ? "mobile" : null);
  }, []);

  const searchMenuActive = openMenu !== "category" && openMenu !== "mobile";
  const activateSearch = useCallback(() => setOpenMenu("search"), []);
  const deactivateSearch = useCallback(() => {
    setOpenMenu((prev) => (prev === "search" ? null : prev));
  }, []);

  return (
    <MainLayout className="overflow-visible sticky top-0 z-40 bg-white shadow-[3px_3px_16.5px_-7.5px_#ccc6c6]">
      <div className="flex items-center justify-between md:gap-x-2 xl:gap-x-8 gap-x-0 mt-3 py-1">
        <NavbarLogo />
        <NavCategoryDropDown
          showDropDown={showCategoryDropDown}
          setShowDropDown={setShowCategoryDropDown}
        />

        <NavItems navItems={navItems} variant="desktop" />
        <NavbarMobile open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

        <NavbarSearch
          isMenuActive={searchMenuActive}
          onActivate={activateSearch}
          onDeactivate={deactivateSearch}
        />
        <NavbarLeft navBarOpen={mobileNavOpen} setNavBarOpen={setMobileNavOpen} />
      </div>
      <OneTap/>
    </MainLayout>
  );
};

export default NavbarLower;
