"use client";
import Link from "next/link";
import MainLayout from "@/components/common/layouts/main/main-layout";
import HeroItem from "../components/hero-item";
import image from "@/public/images/banner-2.jpg";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
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
} from "react-icons/pi";
import { BsHeartPulse } from "react-icons/bs";
import { IoDiamondOutline } from "react-icons/io5";
import { CiDeliveryTruck, CiMoneyCheck1 } from "react-icons/ci";
import { TbMessageCircleQuestion } from "react-icons/tb";

const Hero = () => {
  // Sidebar Categories
  const categories = [
    { name: "Fashion", icon: PiTShirtThin },
    { name: "Home & Garden", icon: PiHouse },
    { name: "Electronics", icon: PiMonitorLight },
    { name: "Furniture", icon: PiArmchair },
    { name: "Health & Beauty", icon: BsHeartPulse },
    { name: "Gift Ideas", icon: PiGiftThin },
    { name: "Toys & Games", icon: PiGameControllerLight },
    { name: "Cooking", icon: PiBowlFoodThin },
    { name: "Smart Phones", icon: PiDeviceMobileCamera },
    { name: "Cameras & Photo", icon: PiCameraLight },
    { name: "Accessories", icon: IoDiamondOutline },
    { name: "View All Categories", icon: null },
  ];

  // Additional Features
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

  // Animation Variants
  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: index * 0.025, duration: 0.5 },
    }),
  };

  const featureSectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <MainLayout className="mt-4">
      <div className="grid grid-cols-12 aspect-video w-full min-h-[250px] max-h-[540px] gap-x-6">
        <div className="max-lg:hidden lg:col-span-3 px-3 py-2 bg-gray-50 rounded-sm">
          <ul>
            {categories.map((item, index) => (
              <motion.li
                className={`p-2.5 my-0.5 text-sm hover:pl-4 hover:text-primary ${
                  index === categories.length - 1
                    ? "font-bold text-xl text-gray-700"
                    : "border-b"    
                }`}
                key={index}
                variants={variants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <Link
                  href="/"
                  className="hover:text-primary hover:font-bold w-full h-full truncate flex items-center gap-x-2"
                >
                  {item.icon && <item.icon size={18} />}
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Main Hero */}
        <div className="col-span-12 lg:col-span-9 rounded-sm overflow-hidden">
          <HeroItem
            name="Samsung Galaxy"
            image={image}
            offer="30% OFF"
            description="Smart Phones"
            category="Smart Phones"
          />
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        className="border border-gray-200 py-5 px-4 mt-6"
        variants={featureSectionVariants}
        initial="hidden"
        animate="visible"
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
