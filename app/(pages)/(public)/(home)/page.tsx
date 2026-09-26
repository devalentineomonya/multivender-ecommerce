"use client"
import Hero from "@/screens/home/widgets/hero";
import TopCategories from "@/screens/home/widgets/top-categories";
import NewsLetter from "@/screens/home/widgets/news-letter";
import BestSelling from "@/screens/home/widgets/best-selling";
import TopBrands from "@/screens/home/widgets/top-brands";
import PopularOffers from "@/screens/home/widgets/product-offers";
import PopularProducts from "@/screens/home/widgets/popular-products";
import OfferBanner from "@/screens/home/widgets/offer-banner";
import BestDeals from "@/screens/home/widgets/best-deals";
import PromotionBanner from "@/screens/home/widgets/promotion-banner";
import MostSelling from "@/screens/home/widgets/most-selling";
import TrendingProducts from "@/screens/home/widgets/trending-products";
import BestStores from "@/screens/home/widgets/best-stores";
import Services from "@/screens/home/widgets/services";
import { useGetUsers } from "@/features/users/get-users";


export default function Home() {
    const {data:users, isError} = useGetUsers()
    console.log(users)
    console.log("Error", isError)
  return (
    <>
      <Hero />
      <TopCategories />
      <BestSelling />
      <TopBrands />
      <PopularOffers />
      <PopularProducts />
      <OfferBanner />
      <BestDeals />
      <PromotionBanner />
      <MostSelling />
      <TrendingProducts />
      <BestStores/>
      <Services/>
      <NewsLetter />
    </>
  );
}
