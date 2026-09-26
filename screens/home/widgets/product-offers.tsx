import SectionLayout from "@/components/common/layouts/section/section-layout";
import furnitureImage from "@/public/images/63e8c4e6cd367817e964f756_sofa-min.png";
import booksImage from "@/public/images/63e8c4e4e006822af104db61_book-min.png";
import clothesImage from "@/public/images/63e8c4e61a7c20076aec5fe7_shirt-min.png";
import studentBags from "@/public/images/63e8c4e53f7127592743f6be_bug & book-min.png"
import PopularOfferCard from "../components/popular-offer-card";
const PopularOffers = () => {
  const offers = [
    {
      name: "Furniture Offer",
      description: "Explore our Furniture and home items Collections ",
      image: furnitureImage,
      value: 100,
      bg: "bg-[#f2e4d9]",
      text: "text-[#cb9917]",
    },
    {
      name: "Books Offer",
      description: "Explore our Books and Educational items Collections ",
      image: booksImage,
      value: 25,
      bg: "bg-[#f9dcdc]",
      text: "text-[#961f1f]",
    },
    {
      name: "Clothes Offer",
      description: "Explore our Clothes and Attires items Collections ",
      image: clothesImage,
      value: 40,
      bg: "bg-[#f2e4d9]",
      text: "text-[#94623c]",
    },
    {
      name: "Student Bags Offer",
      description: "Explore our Student Bags and Carrier items Collections ",
      image: studentBags,
      value: 15,
      bg: "bg-[#d2f7ec]",
      text: "text-[#003d29]",
    },
  ];

  return (
    <SectionLayout title="Get Up to 70% Off">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 w-full">
        {offers.map((offer) => (
          <PopularOfferCard
            bg={offer.bg}
            text={offer.text}
            offer={offer}
            key={offer.name}
          />
        ))}
      </div>
    </SectionLayout>
  );
};

export default PopularOffers;
