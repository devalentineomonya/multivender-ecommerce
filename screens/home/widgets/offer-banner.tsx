"use client";
import { motion, useTransform, useScroll } from "framer-motion";
import BannerImage from "@/public/images/63e8c4e51a7c201f00ec5fe3_biscount_banner-min.png";
import Image from "next/image";
import MainLayout from "@/components/common/layouts/main/main-layout";
import Link from "next/link"
const OfferBanner = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);

  return (
    <div className="relative h-[67vh] my-20 overflow-hidden">
      <motion.div
        style={{ scale }}
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
      >
        <Image
          src={BannerImage}
          alt="Banner Image"
          fill
          className="object-cover"
        />
      </motion.div>
      <MainLayout className="w-full h-full">
        <div className="w-full h-full  flex justify-center md:justify-end ">
          <div className="max-sm:mr-1 max-xl:mr-12 h-[430px] md:h-[481px] w-[513px] bg-primary p-8 sm:p-11 md:p-20 flex flex-col justify-between">
            <div>

            <h2 className="font-bold leading-snug text-4xl md:text-5xl text-white mb-2 capitalize">
              Get 5% Cash Back on $200
            </h2>
            <p className="text-gray-100 font-medium text-lg sm:text-xl ">
              Shopping is a bit of a relaxing hobby for me, which is sometimes
              troubling for the bank balance.
            </p>
            </div>
            <Link className="border border-white  py-3 text-center text-white rounded-full max-w-40" href="/offers">
            Learn More
            </Link>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default OfferBanner;
