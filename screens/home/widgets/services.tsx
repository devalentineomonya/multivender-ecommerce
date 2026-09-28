"use client";
import React from "react";
import SectionLayout from "@/components/common/layouts/section/section-layout";
import ServiceCard from "../components/service-card";
import faqImage from "@/public/images/63e8c4e6cd367817e964f756_sofa-min.png";
import paymentImage from "@/public/images/63e8c4e71eb4ad08ebe75690_visa card 02-min.png";
import deliveryImage from "@/public/images/63e8c4e71eb4ad6d07e7568f_travel-min.png";
import protectionImage from "@/public/images/63e8c4e7e006821d3b04db74_Tote Medium-min.png";
import { useI18nStore } from "@/lib/i18n/store";

const Services = () => {
  const { t } = useI18nStore();

  const SERVICES_DATA = [
    {
      name: t("home.services.faq.name"),
      description: t("home.services.faq.description"),
      image: faqImage,
      href: "/terms",
    },
    {
      name: t("home.services.payment.name"),
      description: t("home.services.payment.description"),
      image: paymentImage,
      href: "/cart",
    },
    {
      name: t("home.services.delivery.name"),
      description: t("home.services.delivery.description"),
      image: deliveryImage,
      href: "/shop",
    },
    {
      name: t("home.services.protection.name"),
      description: t("home.services.protection.description"),
      image: protectionImage,
      href: "/deals",
    },
  ];

  return (
    <SectionLayout title={t("home.services.title")}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
        {SERVICES_DATA.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </SectionLayout>
  );
};

export default Services;
