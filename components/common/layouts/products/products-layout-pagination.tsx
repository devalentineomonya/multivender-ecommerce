import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const ProductsLayoutPagination = () => {
  return (
    <div className="flex justify-center items-center gap-x-3 mt-16 mb-5">
      <div className="h-9 w-9 rounded-md text-white flex justify-center items-center bg-primary cursor-pointer">
        <BiChevronLeft />
      </div>
      <div className="h-9 w-9 rounded-md text-white flex justify-center items-center bg-primary cursor-pointer">
        1
      </div>
      <div className="h-9 w-9 rounded-md text-white flex justify-center items-center bg-primary cursor-pointer">
        2
      </div>
      <div className="h-9 w-9 rounded-md text-white flex justify-center items-center bg-primary cursor-pointer">
        2
      </div>
      <div className="h-9 w-9 rounded-md text-white flex justify-center items-center bg-primary cursor-pointer">
        3
      </div>
      <div className="h-9 w-9 rounded-md text-white flex justify-center items-center bg-primary cursor-pointer">
        4
      </div>
      <div className="h-9 w-9 rounded-md text-white flex justify-center items-center bg-primary cursor-pointer">
        5
      </div>
      <div className="h-9 w-9 rounded-md text-white flex justify-center items-center bg-primary cursor-pointer">
        <BiChevronRight />
      </div>
    </div>
  );
};

export default ProductsLayoutPagination;
