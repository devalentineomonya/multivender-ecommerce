"use client";

import SectionLayout from "@/components/common/layouts/section/section-layout";
import CategoryCard from "../components/category-card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion } from "framer-motion";
import { Navigation } from "swiper/modules";
import { useGetCategories } from "@/features/categories/use-get-categories";
import { useI18nStore } from "@/lib/i18n/store";

const TopCategories: React.FC = () => {
  const { data: categories, isLoading } = useGetCategories();
  const { t } = useI18nStore();

  const fallbackCategories = [
    { id: "1c2b120c-9613-446c-86c1-39f4cb7c2e14", name: "Electronics", imageUrl: null },
    { id: "e019bd1a-da92-434e-89bd-02ba0c1e2f74", name: "Fashion & Apparel", imageUrl: null },
    { id: "4f0368a4-d1a8-4aff-b617-ce1d89f03e44", name: "Home & Living", imageUrl: null },
    { id: "2739a8d3-96ee-4a1c-a1cc-f4acfefb6244", name: "Books & Stationery", imageUrl: null },
    { id: "cecd7fa5-5dff-4784-b9d5-e189e2e3c5dc", name: "Sports & Outdoors", imageUrl: null },
  ];

  const items = categories && categories.length > 0 ? categories : fallbackCategories;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <SectionLayout overflow title={t("products.topCategories")}>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-md w-full aspect-[1/1.3] bg-gray-100 animate-pulse border border-gray-200 p-4 flex flex-col justify-between"
              >
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
                <div className="h-8 w-28 bg-gray-200 rounded-full self-center" />
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {items.map((cat) => (
              <SwiperSlide key={cat.id}>
                <CategoryCard category={cat} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </SectionLayout>
    </motion.div>
  );
};

export default TopCategories;
