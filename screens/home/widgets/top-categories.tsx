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
    { id: "1", name: "Electronics", imageUrl: null },
    { id: "2", name: "Clothing", imageUrl: null },
    { id: "3", name: "Home & Living", imageUrl: null },
    { id: "4", name: "Books", imageUrl: null },
    { id: "5", name: "Sports", imageUrl: null },
  ];

  const items = categories && categories.length > 0 ? categories : fallbackCategories;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <SectionLayout overflow title={t("products.topCategories", "Top Categories")}>
        {isLoading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading categories...</div>
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
