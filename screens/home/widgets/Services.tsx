import React from "react";
import SectionLayout from "@/components/common/layouts/section/section-layout";
import ServiceCard from "../components/service-card";
import faqImage from "@/public/images/63e8c4e6cd367817e964f756_sofa-min.png";
import paymentImage from "@/public/images/63e8c4e71eb4ad08ebe75690_visa card 02-min.png";
import deliveryImage from "@/public/images/63e8c4e71eb4ad6d07e7568f_travel-min.png";
import protectionImage from "@/public/images/63e8c4e7e006821d3b04db74_Tote Medium-min.png";

const SERVICES_DATA = [
  {
    name: "Frequently Asked Questions",
    description: "Get immediate answers about ordering, tracking shipments, returns, and merchant policies.",
    image: faqImage,
    href: "/terms",
  },
  {
    name: "Online Payment Options",
    description: "Secure one-click checkout using Cards, M-Pesa, Bank Transfer, or USSD powered by Paystack.",
    image: paymentImage,
    href: "/cart",
  },
  {
    name: "Express Delivery & Pickup",
    description: "Nationwide doorstep courier or free package pickup from verified regional stations.",
    image: deliveryImage,
    href: "/shop",
  },
  {
    name: "100% Buyer Protection",
    description: "Authenticity guarantee on all vendor items with streamlined returns and quick refunds.",
    image: protectionImage,
    href: "/deals",
  },
];

const Services = () => {
  return (
    <SectionLayout title="Services to help you shop">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
        {SERVICES_DATA.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </SectionLayout>
  );
};

export default Services;
