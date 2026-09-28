"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useModalStore from "@/lib/zustand/news-letter-modal";
import Image, { StaticImageData } from "next/image";
import newsLetterImg1 from "@/public/images/newsletter.jpg";
import newsLetterImg2 from "@/public/images/banner-1.jpg";
import newsLetterImg3 from "@/public/images/banner-3.jpg";
import { toast } from "react-toastify";
import { useI18nStore } from "@/lib/i18n/store";

interface PromoOffer {
  badge: string;
  title: string;
  subtitle: string;
  image: StaticImageData | string;
}

const NewsLetter = () => {
  const { t } = useI18nStore();
  const { open, isOpen, close } = useModalStore();
  // Derived from the active locale on every render, so a mid-session language
  // change updates the copy even if the offer index was already picked.
  const PROMO_OFFERS: PromoOffer[] = [
    { badge: t("newsletter.offer1.badge"), title: t("newsletter.offer1.title"), subtitle: t("newsletter.offer1.subtitle"), image: newsLetterImg1 },
    { badge: t("newsletter.offer2.badge"), title: t("newsletter.offer2.title"), subtitle: t("newsletter.offer2.subtitle"), image: newsLetterImg2 },
    { badge: t("newsletter.offer3.badge"), title: t("newsletter.offer3.title"), subtitle: t("newsletter.offer3.subtitle"), image: newsLetterImg3 },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOffer = PROMO_OFFERS[activeIndex];
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if dismissed in this session or shown within the past 12 hours
    const isDismissed = sessionStorage.getItem("shoppingcart_promo_dismissed");
    const lastSeen = localStorage.getItem("shoppingcart_promo_last_seen");
    const now = Date.now();
    const twelveHours = 12 * 60 * 60 * 1000;

    if (isDismissed || (lastSeen && now - parseInt(lastSeen, 10) < twelveHours)) {
      return;
    }

    // Pick a random promotional offer to shuffle images & text
    const randomIndex = Math.floor(Math.random() * PROMO_OFFERS.length);
    setActiveIndex(randomIndex);

    const timer = setTimeout(() => {
      open();
      localStorage.setItem("shoppingcart_promo_last_seen", now.toString());
    }, 4000);

    return () => clearTimeout(timer);
  }, [open]);

  const handleClose = () => {
    sessionStorage.setItem("shoppingcart_promo_dismissed", "true");
    close();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error(t("newsletter.invalidEmail"));
      return;
    }
    toast.success(t("newsletter.subscribed"));
    sessionStorage.setItem("shoppingcart_promo_dismissed", "true");
    localStorage.setItem("shoppingcart_promo_last_seen", Date.now().toString());
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white aspect-square max-sm:rounded-xl sm:aspect-video sm:w-[calc(100%-50px)] max-w-[820px] overflow-hidden p-0 border border-gray-100 shadow-2xl">
        <div className="relative w-full h-full flex flex-col justify-center">
          <Image
            src={activeOffer.image}
            alt="Promotion Banner"
            fill
            quality={90}
            priority
            className="object-cover absolute inset-0 -z-10 brightness-90"
          />
          {/* Subtle gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/20 -z-10" />

          <div className="h-full w-full sm:max-w-[62%] relative z-10 flex flex-col items-start justify-center p-8 sm:p-10">
            <span className="inline-block bg-primary text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3 shadow-xs">
              {activeOffer.badge}
            </span>
            <h3 className="font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight mb-2">
              {activeOffer.title}
            </h3>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
              {activeOffer.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-3">
              <div className="rounded-full border border-gray-300 bg-white/90 backdrop-blur-xs flex items-center overflow-hidden p-1 shadow-xs focus-within:border-primary">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.emailPlaceholder")}
                  className="w-full px-4 py-2 text-xs sm:text-sm outline-none bg-transparent text-slate-900 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="rounded-full py-2.5 px-5 bg-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shrink-0 cursor-pointer shadow-xs"
                >
                  {t("newsletter.claimOffer")}
                </button>
              </div>

              <div className="flex items-center justify-between w-full px-2 text-[11px] text-gray-500">
                <span>{t("newsletter.instantActivation")}</span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="hover:underline hover:text-slate-800 cursor-pointer"
                >
                  {t("newsletter.dontShowAgain")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsLetter;
