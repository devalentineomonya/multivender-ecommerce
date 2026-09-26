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
            key={footerEndingItem.name}
            variants={itemVariants}
          >
            <Link
              href={footerEndingItem.href || "/"}
              className="flex items-center gap-x-2 hover:text-emerald-800 transition-colors"
            >
              <Image
                src={footerEndingItem.image}
                alt={footerEndingItem.name ?? "footer-ending-image"}
                loading="lazy"
              />
              {footerEndingItem.name}
            </Link>
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
            href="/terms"
            title="Terms of Service"
            aria-label="Terms of Service"
            className="hover:text-primary transition-colors"
          >
            Terms
          </Link>
        </motion.div>
        <motion.div className="max-sm:text-start max-sm:block max-sm:w-full" variants={itemVariants}>
          <Link
            href="/privacy"
            title="Privacy Policy"
            aria-label="Privacy Policy"
            className="hover:text-primary transition-colors"
          >
            Privacy
          </Link>
        </motion.div>
      </motion.div>

      {/* Third Section: Footer Text */}
      <motion.div variants={itemVariants} className="text-gray-500 text-sm">
        Powered by <span className="font-bold text-primary">ShoppingCart</span> © {new Date().getFullYear()}
      </motion.div>
    </motion.div>
  );
};

export default FooterEnding;
