import SectionLayout from "@/components/common/layouts/section/section-layout";
import ServiceCard from "../components/service-card";
import testImage from "@/public/images/63e8c4e6cd367817e964f756_sofa-min.png";
const Services = () => {
  const service = {
    name: "Offer 001",
    description:
      "Culpa voluptate minim amet quis reprehenderit tempor duis enim excepteur commodo velit esse proident. ",
    image: testImage,
    value: 70,
  };
  return (
    <SectionLayout title="Services to help you shop">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
        <ServiceCard service={service} />
        <ServiceCard service={service} />
        <ServiceCard service={service} />
        <ServiceCard service={service} />
      </div>
    </SectionLayout>
  );
};

export default Services;
