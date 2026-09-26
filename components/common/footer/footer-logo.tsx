"use client"
import footerPaymentMethod from "./footerpaymentmethods";
import Logo from "@/public/images/logo.svg";
import Image from "next/image";
import { motion } from "framer-motion";
import { BiCreditCard, BiMobile, BiBuilding, BiHash } from "react-icons/bi";

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
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-full sm:max-w-[440px] mt-2"
          variants={paymentContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {footerPaymentMethod.map((method) => {
            const Icon =
              method.id === "cards"
                ? BiCreditCard
                : method.id === "mpesa"
                ? BiMobile
                : method.id === "bank"
                ? BiBuilding
                : BiHash;

            return (
              <motion.div
                className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-2 hover:bg-primary/10 transition-colors cursor-default"
                variants={paymentMethodVariants}
                key={method.id}
                title={method.detail}
              >
                <Icon className="text-primary text-xl shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[11px] font-bold text-slate-800 leading-tight truncate">
                    {method.name}
                  </span>
                  <span className="text-[9px] font-semibold text-primary leading-tight">
                    {method.tag}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default FooterLogo;
