import React from "react";
import logo from "@/public/images/logo_big.png";
import Image from "next/image";
import Link from "next/link";
import AnimatedIcons from "./animated-icons";
import { Meteors } from "@/components/ui/meteors";
import { useI18nStore } from "@/lib/i18n/store";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
}) => {
  const { t } = useI18nStore();
  return (
    <main className="min-h-[calc(100vh-2.5rem)] w-full">
      <div className="min-h-[calc(100vh-2.5rem)] w-full rounded-md grid grid-cols-12 justify-between">
        <section className="w-full col-span-4 hidden lg:flex items-center justify-center h-full overflow-hidden relative bg-[#f7fbff] border-r border-gray-100">
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Meteors number={40} />
          </div>
          <AnimatedIcons />
        </section>
        <section className="col-span-12 lg:col-span-8 min-h-full px-4 py-8 flex justify-center items-center bg-[#fffffa] flex-col">
          <div className="flex flex-col justify-center items-center max-w-96 w-full text-center">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105 mb-2"
              title={t("auth.returnHome")}
            >
              <Image
                src={logo}
                alt={t("auth.storeLogoAlt")}
                priority
                className="h-12 w-auto object-contain mx-auto"
              />
            </Link>
            <h2 className="text-center font-bold text-3xl mt-3 text-slate-800 tracking-tight">
              {title}
            </h2>
            <p className="text-center font-medium text-gray-500 mt-2 text-sm">
              {description}
            </p>
          </div>
          <div className="w-full max-w-96">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
