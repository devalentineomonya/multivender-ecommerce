"use client";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { motion } from "framer-motion";

interface ServiceCardProps {
  service: {
    name: string;
    description: string;
    image: string | StaticImageData;
    value?: number;
    href?: string;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  // Animation variants
  const animationVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  const card = (
    <motion.div
      className="card-surface card-interactive group grid h-fit w-full min-w-full max-w-full max-h-72 grid-rows-2 overflow-hidden sm:min-h-[400px] sm:max-w-[300px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={animationVariants}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 pt-7"
      >
        <h4 className="font-semibold text-slate-800 text-lg mb-2 group-hover:text-primary transition-colors">
          {service.name}
        </h4>
        <p className="text-sm font-medium text-gray-500 leading-snug line-clamp-3">
          {service.description}
        </p>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={animationVariants}
        transition={{ duration: 0.32, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.2 }}
        className="service-image overflow-hidden"
      >
        <Image
          className="h-full w-full object-cover"
          src={service?.image}
          alt={service?.name ?? "service-image"}
          loading="lazy"
        />
      </motion.div>
    </motion.div>
  );

  if (service.href) {
    return (
      <a href={service.href} className="block w-full h-full">
        {card}
      </a>
    );
  }

  return card;
};

export default ServiceCard;
