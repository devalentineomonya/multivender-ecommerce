"use client"
import Link from "next/link";
import Image from "next/image";
import footerEnding from "./footerendings";
import { motion } from "framer-motion";

const FooterEnding = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Staggered animations for each item
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex justify-between items-center flex-col gap-y-12 md:flex-row font-semibold text-gray-500 pt-2 pb-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {/* First Section: Icons and Names */}
      <motion.div
        className="flex max-sm:flex-col max-sm:items-start w-full  gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
      >
        {footerEnding?.map((footerEndingItem) => (
          <motion.div
            className="flex  gap-x-2"
            key={footerEndingItem.name}
            variants={itemVariants}
          >
            <Image
              src={footerEndingItem.image}
              alt={footerEndingItem.name ?? "footer-ending-image"}
              loading="lazy"
            />
            {footerEndingItem.name}
          </motion.div>
        ))}
      </motion.div>

      {/* Second Section: Links */}
      <motion.div
        className="flex items-start gap-x-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
      >
        <motion.div className="max-sm:text-start max-sm:block max-sm:w-full" variants={itemVariants}>
          <Link
            href="/"
            title="Terms Of Services"
            aria-label="Terms Of Services"
          >
            Term of Services
          </Link>
        </motion.div>
        <motion.div className="max-sm:text-start max-sm:block max-sm:w-full" variants={itemVariants}>
          <Link
            href="/"
            title="Privacy and Policy"
            aria-label="Privacy and Policy"
          >
            Privacy and Policy
          </Link>
        </motion.div>
      </motion.div>

      {/* Third Section: Footer Text */}
      <motion.div variants={itemVariants}>
        All Rights Reserved from
        <Link
          href="https://devalentineomonya.vercel.app"
          target="_blank"
          className="text-green-600 underline mx-3"
          title="My Portfolio"
          aria-label="My Portfolio"
        >
          Devalentine
        </Link>
        | {new Date().getFullYear()}
      </motion.div>
    </motion.div>
  );
};

export default FooterEnding;
