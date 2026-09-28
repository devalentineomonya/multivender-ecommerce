import { Suspense } from "react";
import ProductsLayoutHero from "./products-layout-hero";
import ProductsLayoutMain from "./products-layout-main";
import { ProductsPageSkeleton, type ProductsVariant } from "@/components/shared/skeletons";

const ProductsLayout = ({ variant }: { variant: ProductsVariant }) => {
  return (
    <Suspense fallback={<ProductsPageSkeleton variant={variant} />}>
      <ProductsLayoutHero variant={variant} />
      <ProductsLayoutMain variant={variant} />
    </Suspense>
  );
};

export default ProductsLayout;
