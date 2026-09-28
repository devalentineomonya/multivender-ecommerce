"use client"
import footerLinks from "./footerlinks";
import MainLayout from "../layouts/main/main-layout";
import FooterEnding from "./footer-ending";
import FooterLinksList from "./footer-links-list";
import FooterLogo from "./footer-logo";
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { EXCLUDED_PATHS } from "@/lib/constants";

const Footer = () => {
  const pathname = usePathname()

  const shouldDisplayFooter = !EXCLUDED_PATHS.some(path => pathname.startsWith(path))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!shouldDisplayFooter) return null;

  return (
    <MainLayout>
      <footer className="flex lg:flex-row flex-col gap-y-12 mt-16 mb-7 border-y-2 py-12 border-gray-300 gap-x-16 overflow-x-clip">
        <div className="w-full lg:w-1/2">
          <FooterLogo />
        </div>
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 justify-between w-full items-start gap-x-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {footerLinks?.map((footerLink) => (
            <motion.div variants={itemVariants} key={footerLink.title}>
              <FooterLinksList
                title={footerLink.title}
                links={footerLink.links}
              />
            </motion.div>
          ))}
        </motion.div>
      </footer>
      <FooterEnding />
    </MainLayout>
  );
};

export default Footer;
