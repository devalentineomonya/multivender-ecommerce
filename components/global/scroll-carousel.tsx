"use client";
import React, { useState, useRef, useEffect, ReactNode } from "react";

interface ScrollCarouselProps {
  children: ReactNode;
}

const ScrollCarousel: React.FC<ScrollCarouselProps> = ({ children }) => {
  const [viewedItems, setViewedItems] = useState<number>(4);
  const totalItems = React.Children.count(children);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollLeft = carouselRef.current.scrollLeft;
        const clientWidth = carouselRef.current.clientWidth;
        const newIndex = Math.floor(scrollLeft / (clientWidth / 4)) + 4;
        setViewedItems(Math.min(newIndex, totalItems));
      }
    };

    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener("scroll", handleScroll);
      carouselElement.addEventListener("drag", handleScroll);
    }

    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [totalItems]);

  return (
    <div className="relative w-full h-fit overflow-hidden hide-scrollbar">
      <div
        className="flex overflow-x-auto overflow-y-hidden scroll-smooth pb-3 overscroll-x-contain touch-pan-x hide-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden *:flex-none *:mx-[5px] *:w-[calc(100%-10px)] sm:*:w-[calc(50%-10px)] md:*:w-[calc(33.33%-10px)] xl:*:w-[calc(25%-10px)]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        ref={carouselRef}
      >
        {children}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#e0e0e0] hide-scrollbar">
        <div
          className="cursor-grabbing h-full bg-[#76c7c0] hide-scrollbar"
          style={{ width: `${(viewedItems / totalItems) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ScrollCarousel;
