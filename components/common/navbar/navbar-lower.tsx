"use client"
import { useEffect, useRef, useState, useCallback } from "react";
import MainLayout from "../layouts/main/main-layout";
import navItems from "./navbaritems";
import NavbarLogo from "./navbar-logo";
import NavItems from "./nav-items";
import NavbarSearch from "./navbar-search";
import NavbarLeft from "./navbar-left";
import NavbarMobile from "./navbar-mobile";
import NavCategoryDropDown from "./nav-category-drop-down";
import useBrowserWidth from "@/hooks/useBrowserWidth";
import OneTap from "./one-tap";

/** At most one of these is open at a time, app-wide. */
type OpenMenu = "category" | "search" | "mobile" | null;

const NavbarLower: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [activePage, setActivePage] = useState<number>(0);

  const pagePath = useRef<string>("");

  const { isMobile } = useBrowserWidth();

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname.includes("/")) {
      pagePath.current = pathname.split("/")[1] || "";
    } else {
      pagePath.current = pathname.substring(1);
    }
  }, []);

  useEffect(() => {
    const currentNavItem = navItems.find(
      (navItem) => navItem.href.substring(1) === pagePath.current
    );

    if (currentNavItem) {
      const index = navItems.indexOf(currentNavItem);
      setActivePage(index);
    }
  }, [pagePath]);

  const handlePageChange = useCallback((index: number) => {
    setActivePage(index);
  }, []);

  const onEnterClick = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      if (event.key === "Enter") {
        handlePageChange(index);
      }
    },
    [handlePageChange]
  );

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

        <NavbarMobile
          isMobile={isMobile}
          setNavBarOpen={setMobileNavOpen}
          navBarOpen={mobileNavOpen}
        >
          <NavItems
            navItems={navItems}
            activePage={activePage}
            handlePageChange={handlePageChange}
            onEnterClick={onEnterClick}
          />
        </NavbarMobile>

        <NavbarSearch
          isMenuActive={searchMenuActive}
          onActivate={activateSearch}
          onDeactivate={deactivateSearch}
        />
        <NavbarLeft isMobile={isMobile} navBarOpen={mobileNavOpen} setNavBarOpen={setMobileNavOpen} />
      </div>
      <OneTap/>
    </MainLayout>
  );
};

export default NavbarLower;
