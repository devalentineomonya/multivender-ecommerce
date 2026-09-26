import { BsX } from "react-icons/bs";
import { ReactNode, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavbarMobileProps {
  isMobile: boolean;
  setNavBarOpen: (isOpen: boolean) => void;
  navBarOpen: boolean;
  children: ReactNode;
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({
  isMobile,
  setNavBarOpen,
  navBarOpen,
  children,
}) => (
  <motion.nav
    className={cn(
      "flex items-center justify-center gap-x-3",
      isMobile && "fixed w-[calc(100%-20px)] h-0 left-1/2 bg-white -translate-x-1/2 -translate-y-1/2 py-5 rounded-md shadow-md z-10",
      navBarOpen && "h-72 mt-24 "
    )}
    initial={{ top: '-100%' }}
    animate={{
      top: navBarOpen ? '10%' : '-100%'
    }}
    exit={{ top: '-100%' }}
    transition={{ duration: 0.5 }}
  >
    <div
      className={cn(
        "absolute top-2 right-2 cursor-pointer",
        !isMobile && "hidden"
      )}
      onClick={() => setNavBarOpen(false)}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
          setNavBarOpen(false);
        }
      }}
      tabIndex={0}
    >
      <BsX size={40} />
    </div>
    {children}
  </motion.nav>
);

export default NavbarMobile;
