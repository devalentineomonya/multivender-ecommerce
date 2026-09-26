"use client";
import NavbarTop from "./navbar-top";
import NavbarLower from "./navbar-lower";
import { usePathname } from "next/navigation";
import { EXCLUDED_PATHS } from "@/lib/constants";


const NavbarMain = () => {
  const pathname = usePathname();

  // Check if the current pathname is in the excluded paths list
  const shouldDisplayNavbar = !EXCLUDED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <>
          <NavbarTop stickToTop={!shouldDisplayNavbar} />
      {shouldDisplayNavbar && (
        <>

          <NavbarLower />

        </>
      )}
    </>
  );
};

export default NavbarMain;
