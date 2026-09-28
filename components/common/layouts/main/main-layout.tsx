import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

// A generic centering wrapper, not a page landmark — rendering it as <main> produced
// several <main> elements per page. app/layout.tsx wraps {children} in the one real <main>.
const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div
      className={cn(
        "flex justify-center items-center w-full relative z-10 overflow-clip",
        className
      )}
    >
      <div className="container max-w-7xl px-3">{children}</div>
    </div>
  );
};

export default MainLayout;
