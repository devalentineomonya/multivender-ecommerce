"use client"
import footerPaymentMethod from "./footerpaymentmethods";
import Logo from "@/public/images/logo.svg";
import Image from "next/image";
import { motion } from "framer-motion";

function FooterLogo() {
  // Animation Variants
  const logoAndDescriptionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const paymentContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger animations for payment methods
      },
    },
  };

  const paymentMethodVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="footer-logo-container">
      {/* Logo Animation */}
      <motion.div
        className="mb-8"
        variants={logoAndDescriptionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <Image src={Logo} alt="logo-image" loading="lazy" />
      </motion.div>

      {/* Description Animation */}
      <motion.p
        className="text-[14px] font-semibold text-gray-500 mb-8"
        variants={logoAndDescriptionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Welcome to our company! We are dedicated to providing you with the best
        products and services. Our commitment to quality and customer
        satisfaction drives everything we do. Thank you for choosing us as your
        trusted partner.
      </motion.p>

      {/* Payment Methods Animation */}
      <div className="w-full">
        <h3 className="mb-3 font-semibold text-slate-700 text-[18px]">
          Accepted Payments
        </h3>
        <motion.div
          className="grid grid-cols-4 gap-y-3 justify-center items-center max-w-full sm:max-w-[350px] mt-2"
          variants={paymentContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {footerPaymentMethod?.map((method) => (
            <motion.div
              className="rounded-md border border-gray-300 py-3 px-5 max-w-[80px] max-h-[48px] min-w-[80px] min-h-[48px] hover:bg-gray-100 cursor-pointer"
              variants={paymentMethodVariants}
              key={method.name}
            >
              <Image
                src={method.image}
                alt={method.name ?? "payment-method-image"}
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default FooterLogo;
