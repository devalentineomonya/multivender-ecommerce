import { Suspense } from "react";
import ProductsLayoutHero from "./products-layout-hero";
import ProductsLayoutMain from "./products-layout-main";

const ProductsLayout = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      }
    >
      <ProductsLayoutHero />
      <ProductsLayoutMain />
    </Suspense>
  );
};

export default ProductsLayout;

