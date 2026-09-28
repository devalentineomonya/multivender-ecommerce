"use client";

import { BsChevronDown } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/features/categories/use-get-categories";
import { useI18nStore } from "@/lib/i18n/store";

interface NavCategoryDropDownProps {
  showDropDown: boolean;
  setShowDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CategoryItemProps {
  id: string;
  image?: string | null;
  name: string;
  count: number;
  brand?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

const NavCategoryDropDown: React.FC<NavCategoryDropDownProps> = ({
  showDropDown,
  setShowDropDown,
}) => {
  const { data: dbCategories, isLoading } = useGetCategories();
  const { t } = useI18nStore();

  const fallbackCategories = [
    { id: "1", name: "Electronics", imageUrl: "/images/electronics.png", productCount: 12 },
    { id: "2", name: "Fashion", imageUrl: "/images/fashion.png", productCount: 24 },
    { id: "3", name: "Home & Living", imageUrl: "/images/home.png", productCount: 18 },
    { id: "4", name: "Beauty & Health", imageUrl: "/images/beauty.png", productCount: 8 },
  ];

  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : fallbackCategories;

  const dropdownVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  return (
    <div className="relative flex">
      <div
        className="text-gray-600 max-xl:text-xl relative whitespace-nowrap flex justify-center items-center gap-x-1 cursor-pointer hover:text-primary transition-colors"
        onClick={() => setShowDropDown((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setShowDropDown((prev) => !prev);
          }
        }}
        tabIndex={0}
      >
        {t("nav.categories")}
        <BsChevronDown
          className={cn("transition-all ease-in-out duration-300", {
            "rotate-180": showDropDown,
          })}
        />
      </div>

      {showDropDown && (
        <motion.div
          className={cn(
            "absolute bg-white min-w-[700px] w-full mt-12 p-5 rounded-md left-0 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 z-30"
          )}
          initial="closed"
          animate="open"
          exit="closed"
          variants={dropdownVariants}
        >
          <div className="flex justify-between items-center text-gray-800 font-bold text-lg pb-3 mb-3 border-b border-gray-200">
            <span>{t("products.topCategories")}</span>
            <Link
              href="/shop"
              className="text-xs text-primary font-medium hover:underline"
              onClick={() => setShowDropDown(false)}
            >
              View All
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-full rounded-md bg-gray-100 animate-pulse h-16 p-2 flex gap-x-3 items-center">
                  <div className="w-14 h-14 bg-gray-200 rounded-md shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  id={category.id}
                  image={category.imageUrl}
                  name={category.name}
                  count={category.productCount || 0}
                  onClick={() => setShowDropDown(false)}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const CategoryItem: React.FC<CategoryItemProps> = ({
  id,
  image,
  name,
  count,
  brand = false,
  onClick,
}) => {
  const { t } = useI18nStore();
  const placeholderImg = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150&auto=format&fit=crop&q=80";

  return (
    <Link
      href={`/shop?category=${encodeURIComponent(id)}`}
      title={name}
      aria-label={name}
      onClick={onClick}
    >
      <div
        className={cn(
          "w-full rounded-md bg-gray-50 hover:bg-gray-100 transition-colors min-h-16 flex gap-x-3 p-2 pl-3 justify-start items-center border border-gray-100 hover:border-primary/30",
          brand && "hover:border border-primary"
        )}
      >
        <div className="bg-white rounded-md w-14 h-14 relative overflow-hidden flex-shrink-0 border border-gray-200">
          <Image
            src={image || placeholderImg}
            alt={name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="category-card-text">
          <h6 className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors">
            {name}
          </h6>
          <p className="text-xs text-gray-500">
            {count} {t("products.itemsAvailable")}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default NavCategoryDropDown;
