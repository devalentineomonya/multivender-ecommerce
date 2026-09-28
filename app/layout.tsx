import type { Metadata } from "next";
import "./globals.css";
import NavbarMain from "@/components/common/navbar/navbar-main";
import { Inter } from "next/font/google";
import Footer from "@/components/common/footer/footer";
import { QueryProvider } from "@/providers/query-provider";
import { ProgressBarProviders } from "@/providers/progress-bar-provider";

import { I18nProvider } from "@/providers/i18n-provider";
import { getServerI18n } from "@/lib/i18n/server";
import { MotionConfig } from "framer-motion";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Zoom, ToastContainer } from "react-toastify";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "DevalShoppingCart | Excellent Shopping Experience",
  description:
    "Discover unbeatable deals and a seamless shopping experience at DevalShoppingCart. Shop a wide range of high-quality products, enjoy secure payments, and fast shipping. Join our community of satisfied customers and elevate your shopping experience today!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const i18n = await getServerI18n();

  return (
    <html lang={i18n.locale}>
      <body className={`${inter.className} antialiased`}>
        <I18nProvider initial={i18n}>
          <MotionConfig reducedMotion="user">
            <NuqsAdapter>
              <QueryProvider>
                <ProgressBarProviders>
                  <NavbarMain />
                  {children}
                  <Footer />
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    closeButton={false}
                    hideProgressBar
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Zoom}
                  />
                </ProgressBarProviders>
              </QueryProvider>
            </NuqsAdapter>
          </MotionConfig>
        </I18nProvider>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
