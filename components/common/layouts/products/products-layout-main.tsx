import Services from "@/screens/home/widgets/services";
import PopularProducts from "@/screens/home/widgets/popular-products";
import ProductCard from "@/components/shared/product-card/product-card";
import SectionLayout from "../section/section-layout";
import ProductsLayoutFilter from "./products-layout-filter";
import ProductsLayoutPagination from "./products-layout-pagination";

const ProductsLayoutMain = () => {
  return (
    <>
      <ProductsLayoutFilter />
      <SectionLayout title="Products For You !">
        <div className="grid sm:justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-12">
          <ProductCard product={{ id: 1, name: "Product 1", price: 29.99, image: "image1.jpg", shortDescription: "Description of Product 1" }} />
          <ProductCard product={{ id: 2, name: "Product 2", price: 39.99, image: "image2.jpg", shortDescription: "Description of Product 2" }} />
          <ProductCard product={{ id: 3, name: "Product 3", price: 49.99, image: "image3.jpg", shortDescription: "Description of Product 3" }} />
          <ProductCard product={{ id: 4, name: "Product 4", price: 59.99, image: "image4.jpg", shortDescription: "Description of Product 4" }} />
          <ProductCard product={{ id: 5, name: "Product 5", price: 69.99, image: "image5.jpg", shortDescription: "Description of Product 5" }} />
          <ProductCard product={{ id: 6, name: "Product 6", price: 79.99, image: "image6.jpg", shortDescription: "Description of Product 6" }} />
          <ProductCard product={{ id: 7, name: "Product 7", price: 89.99, image: "image7.jpg", shortDescription: "Description of Product 7" }} />
          <ProductCard product={{ id: 8, name: "Product 8", price: 99.99, image: "image8.jpg", shortDescription: "Description of Product 8" }} />
          <ProductCard product={{ id: 9, name: "Product 9", price: 109.99, image: "image9.jpg", shortDescription: "Description of Product 9" }} />
          <ProductCard product={{ id: 10, name: "Product 10", price: 119.99, image: "image10.jpg", shortDescription: "Description of Product 10" }} />
        </div>
        <ProductsLayoutPagination />
        <PopularProducts />
        <Services />
      </SectionLayout>
    </>
  );
};

export default ProductsLayoutMain;
