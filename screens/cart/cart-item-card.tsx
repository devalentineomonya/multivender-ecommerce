import Link  from "next/link";
import Image from "next/image"
import testImage from "@/public/images/63e8c4e4aed3c6720e446aa1_airpod max-min.png";
const CartItemCard = () => {
  return (
    <Link href="/product/djhdjddj" title="View More" aria-label="View More">
      <div className="w-full h-fit flex gap-x-4 max-w-[500px] min-h-28 items-center px-4 border-b-2 border-gray-100 hover:bg-gray-50 cursor-pointer rounded-sm mt-2 pb-1">
        <div className="w-24 aspect-square flex justify-center items-center gap-x-1 sm:gap-x-2">
          <p>3</p>
          <Image src={testImage} alt="" loading="lazy" />
        </div>
        <div className="flex w-full">
          <div className="flex flex-1 flex-col text-end sm:text-start">
            <h2 className="font-semibold text-slate-900">AirPods Max</h2>
            <p className="text-slate-600 text-sm mt-1">color: Pink</p>
          </div>
          <div className="flex flex-1 flex-col text-end sm:text-start">
            <p className="text-slate-800 text-sm font-semibold">Kes 123.00</p>
            <p>quantity: 1</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default CartItemCard;
