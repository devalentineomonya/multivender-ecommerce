import cardOne from "@/public/images/63e8c4e768e3260571e48a0c_visa card-min.png";
import cardTwo from "@/public/images/63e8c4e71eb4ad08ebe75690_visa card 02-min.png";
import cardThree from "@/public/images/63ea1a963f08a8c3dcd7c945_visa card 03.svg";
import MainLayout from "@/components/common/layouts/main/main-layout";
import Image from "next/image";
import Link from "next/link";
import { useI18nStore } from "@/lib/i18n/store";
const PromotionBanner = () => {
  const { t } = useI18nStore();
  return (
    <MainLayout className="bg-tint-peach mt-24">
      <div className="h-80 max-w6xl flex justify-between items-center px-10 mx-auto">
        <div className="w-full">
          <h1 className="font-bold text-5xl text-black mb-4">{t("home.promoBanner.title")}</h1>
          <p className="font-semibold text-slate-800 pl-4 flex gap-x-3">
            {t("home.promoBanner.on")}
            <Link
              href="/shop"
              title={t("home.promoBanner.startShopping")}
              aria-label={t("home.promoBanner.startShopping")}
            >
              ShoppingCart.com
            </Link>
          </p>

          <Link
            href="/deals"
            className="inline-block py-3 px-10 rounded-full bg-primary text-white hover:bg-black mt-4 transition-colors font-semibold text-sm"
            title={t("home.promoBanner.exploreDeals")}
          >
            {t("common.learnMore")}
          </Link>
        </div>
        <div className="relative h-full w-full flex items-center justify-end pr-4">
          <div className="relative flex items-center justify-center w-72 h-64">
            {/* Card 1: Fanned Left / Bottom */}
            <div className="absolute z-10 transition-transform duration-300 transform -rotate-[14deg] -translate-x-8 translate-y-2 drop-shadow-xl hover:-rotate-[18deg]">
              <Image
                src={cardOne}
                alt="Payment Card 1"
                className="w-52 sm:w-60 h-auto rounded-xl"
              />
            </div>
            {/* Card 2: Center Spine */}
            <div className="absolute z-20 transition-transform duration-300 transform -rotate-[2deg] translate-y-0 drop-shadow-2xl hover:scale-105">
              <Image
                src={cardTwo}
                alt="Payment Card 2"
                className="w-52 sm:w-60 h-auto rounded-xl"
              />
            </div>
            {/* Card 3: Fanned Right / Front */}
            <div className="absolute z-30 transition-transform duration-300 transform rotate-[14deg] translate-x-8 translate-y-3 drop-shadow-2xl hover:rotate-[18deg]">
              <Image
                src={cardThree}
                alt="Payment Card 3"
                className="w-52 sm:w-60 h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PromotionBanner;
