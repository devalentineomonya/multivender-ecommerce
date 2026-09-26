"use client";
import React from "react";
import Link from "next/link";
import MainLayout from "@/components/common/layouts/main/main-layout";
import HeroItem from "../components/hero-item";
import image from "@/public/images/banner-2.jpg";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import {
  PiTShirtThin,
  PiHouse,
  PiMonitorLight,
  PiArmchair,
  PiGiftThin,
  PiGameControllerLight,
  PiBowlFoodThin,
  PiDeviceMobileCamera,
  PiCameraLight,
  PiBriefcaseLight,
  PiBookOpenThin,
  PiCoffeeThin,
} from "react-icons/pi";
import { BsHeartPulse } from "react-icons/bs";
import { IoDiamondOutline } from "react-icons/io5";
import { CiDeliveryTruck, CiMoneyCheck1 } from "react-icons/ci";
import { TbMessageCircleQuestion } from "react-icons/tb";

const Hero = () => {
  // Sidebar Categories (11 core departments + View All)
  const categories = [
    { name: "Fashion", icon: PiTShirtThin, href: "/shop?category=e019bd1a-da92-434e-89bd-02ba0c1e2f74" },
    { name: "Home & Garden", icon: PiHouse, href: "/shop?category=4f0368a4-d1a8-4aff-b617-ce1d89f03e44" },
    { name: "Electronics", icon: PiMonitorLight, href: "/shop?category=1c2b120c-9613-446c-86c1-39f4cb7c2e14" },
    { name: "Smart Phones", icon: PiDeviceMobileCamera, href: "/shop?category=fa45f917-a98c-4056-b1f4-661e0182a2be" },
    { name: "Computing", icon: PiBriefcaseLight, href: "/shop?category=bd80ff30-fcef-4028-8b56-c8c58fd2af3e" },
    { name: "Health & Beauty", icon: BsHeartPulse, href: "/shop?category=87376ae2-cdd6-4278-a786-f6ac547aacb0" },
    { name: "Food & Groceries", icon: PiCoffeeThin, href: "/shop?category=5d3bb81c-6916-41fe-b5e3-378ae96eea44" },
    { name: "Furniture", icon: PiArmchair, href: "/shop?category=3e877fd1-f58a-43f5-bd57-7b73fed9add6" },
    { name: "Toys & Games", icon: PiGameControllerLight, href: "/shop?category=5e39c632-3c17-4ea8-b678-ac15d0583547" },
    { name: "Cooking", icon: PiBowlFoodThin, href: "/shop?category=6a5a768c-d786-43e5-8dd4-0a29548263dd" },
    { name: "Books & Stationery", icon: PiBookOpenThin, href: "/shop?category=2739a8d3-96ee-4a1c-a1cc-f4acfefb6244" },
    { name: "View All Categories", icon: null, href: "/categories" },
  ];

  // Alternating Hero Banners (left-to-right / right-to-left)
  const heroSlides = [
    {
      name: "Samsung Galaxy",
      image: image,
      offer: "30% OFF",
      description: "Smart Phones",
      category: "SMART PHONES",
      rtl: true, // Right to left as in user screenshot
      link: "/shop?search=Samsung",
    },
    {
      name: "Designer Summer Styles",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80",
      offer: "50% OFF",
      description: "Trending Collection",
      category: "FASHION & APPAREL",
      rtl: false, // Left to right
      link: "/shop?category=e019bd1a-da92-434e-89bd-02ba0c1e2f74",
    },
    {
      name: "4K QLED & Smart Audio",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1600&auto=format&fit=crop&q=80",
      offer: "40% OFF",
      description: "Home Entertainment",
      category: "ELECTRONICS",
      rtl: true, // Right to left
      link: "/shop?category=1c2b120c-9613-446c-86c1-39f4cb7c2e14",
    },
  ];

  // Additional Features from original screenshot
  const features = [
    {
      icon: CiDeliveryTruck,
      title: "Free Delivery",
      description: "For all orders over $99",
    },
    {
      icon: PiBriefcaseLight,
      title: "Secure Payment",
      description: "We ensure secure payment",
    },
    {
      icon: CiMoneyCheck1,
      title: "Money Back Guarantee",
      description: "Any back within 30 days",
    },
    {
      icon: TbMessageCircleQuestion,
      title: "Customer Support",
      description: "Call or email us 24/7",
    },
  ];

  // Clean animation without glitchy layout shifts
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: index * 0.03, duration: 0.3 },
    }),
  };

  const featureSectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <MainLayout className="mt-4">
      <div className="grid grid-cols-12 aspect-video w-full min-h-[250px] max-h-[540px] gap-x-6">
        {/* Sidebar Categories */}
        <div className="max-lg:hidden lg:col-span-3 px-3 py-2 bg-gray-50 rounded-sm flex flex-col justify-between overflow-hidden">
          <ul className="flex flex-col justify-between h-full">
            {categories.map((item, index) => (
              <motion.li
                className={`py-1 px-2 my-px text-xs xl:text-sm hover:pl-3 hover:text-primary transition-all ${
                  index === categories.length - 1
                    ? "font-bold text-xs xl:text-sm text-primary pt-1.5 border-t border-gray-200 mt-1"
                    : "border-b border-gray-100"
                }`}
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <Link
                  href={item.href}
                  className="hover:text-primary hover:font-bold w-full h-full truncate flex items-center gap-x-2"
                >
                  {item.icon && <item.icon size={16} />}
                  <span>{item.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Main Hero Banner with Left-to-Right / Right-to-Left Alternation */}
        <div className="col-span-12 lg:col-span-9 rounded-sm overflow-hidden">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="w-full h-full"
          >
            {heroSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                <HeroItem
                  name={slide.name}
                  image={slide.image}
                  offer={slide.offer}
                  description={slide.description}
                  category={slide.category}
                  rtl={slide.rtl}
                  link={slide.link}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        className="border border-gray-200 py-5 px-4 mt-6"
        variants={featureSectionVariants}
        initial="hidden"
        whileInView="visible"
      >
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {features.map((feature, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center gap-x-3">
                <feature.icon size={48} />
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-xs">{feature.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </MainLayout>
  );
};

export default Hero;
