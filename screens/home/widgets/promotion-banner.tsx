import cardOne from "@/public/images/63e8c4e768e3260571e48a0c_visa card-min.png";
import cardTwo from "@/public/images/63e8c4e71eb4ad08ebe75690_visa card 02-min.png";
import cardThree from "@/public/images/63ea1a963f08a8c3dcd7c945_visa card 03.svg";
import MainLayout from "@/components/common/layouts/main/main-layout";
import Image from "next/image";
import Link from "next/link";
const PromotionBanner = () => {
  return (
    <MainLayout className="bg-[#ffe6cc] mt-24">
      <div className="h-80 max-w6xl flex justify-between items-center px-10 mx-auto">
        <div className="w-full">
          <h1 className="font-bold text-5xl text-black mb-4">
            {" "}
            Get 5% Cash Discount
          </h1>
          <p className="font-semibold text-slate-800 pl-4 flex gap-x-3">
            on
            <Link
              href="/shop"
              title="Start Shopping"
              aria-label="Start Shopping"
            >
              ShoppingCart.com
            </Link>
          </p>

          <button
            className="py-3 px-10 rounded-full bg-primary text-white hover:bg-black mt-4"
            title="Learn More"
            aria-label="Learn More"
          >
            Learn More
          </button>
        </div>
        <div className="z-10  relative h-full w-full flex justify-end   rotate-12">
          <div className="absolute -top-9 bottom-auto -right-[20px] left-auto rotate-[-6.6deg]">
            <Image
              src={cardOne}
              loading="lazy"
              alt="card-one"
              className="max-w-full align-middle inline-block pt-28"
            />
          </div>
          <div className="z-[1] absolute -top-[18px] bottom-auto -right-[9px] left-auto rotate-[-10.6deg]">
            <Image
              src={cardTwo}
              loading="lazy"
              alt="card-two"
              className="max-w-full align-middle inline-block pt-28"
            />
          </div>
          <div className="absolute -right-[2px]  bottom-auto rotate-[20deg]">
            <Image
              src={cardThree}
              loading="lazy"
              alt="card-three"
              className="max-w-full align-middle inline-block pt-28"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PromotionBanner;
