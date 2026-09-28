"use client";
import SectionLayout from "@/components/common/layouts/section/section-layout";
import furnitureImage from "@/public/images/63e8c4e6cd367817e964f756_sofa-min.png";
import booksImage from "@/public/images/63e8c4e4e006822af104db61_book-min.png";
import clothesImage from "@/public/images/63e8c4e61a7c20076aec5fe7_shirt-min.png";
import studentBags from "@/public/images/63e8c4e53f7127592743f6be_bug & book-min.png"
import PopularOfferCard from "../components/popular-offer-card";
import { useI18nStore } from "@/lib/i18n/store";

const PopularOffers = () => {
  const { t } = useI18nStore();

  const offers = [
    {
      name: t("home.popularOffers.furniture.name"),
      description: t("home.popularOffers.furniture.description"),
      image: furnitureImage,
      value: 13000,
      bg: "bg-[#f2e4d9]",
      text: "text-[#cb9917]",
      href: "/shop?category=3e877fd1-f58a-43f5-bd57-7b73fed9add6",
    },
    {
      name: t("home.popularOffers.books.name"),
      description: t("home.popularOffers.books.description"),
      image: booksImage,
      value: 3250,
      bg: "bg-[#f9dcdc]",
      text: "text-[#961f1f]",
      href: "/shop?category=2739a8d3-96ee-4a1c-a1cc-f4acfefb6244",
    },
    {
      name: t("home.popularOffers.clothes.name"),
      description: t("home.popularOffers.clothes.description"),
      image: clothesImage,
      value: 5200,
      bg: "bg-[#f2e4d9]",
      text: "text-[#94623c]",
      href: "/shop?category=e019bd1a-da92-434e-89bd-02ba0c1e2f74",
    },
    {
      name: t("home.popularOffers.bags.name"),
      description: t("home.popularOffers.bags.description"),
      image: studentBags,
      value: 1950,
      bg: "bg-[#d2f7ec]",
      text: "text-[#003d29]",
      href: "/shop?category=bd80ff30-fcef-4028-8b56-c8c58fd2af3e",
    },
  ];

  return (
    <SectionLayout title={t("home.popularOffers.title")}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 w-full">
        {offers.map((offer) => (
          <PopularOfferCard
            bg={offer.bg}
            text={offer.text}
            offer={offer}
            key={offer.name}
          />
        ))}
      </div>
    </SectionLayout>
  );
};

export default PopularOffers;
