"use client";
import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useModalStore from "@/lib/zustand/news-letter-modal";
import Image from "next/image";
import NewsLetterImage from "@/public/images/newsletter.jpg";
const NewsLetter = () => {
  const { open, isOpen, close } = useModalStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      open();
    }, 3000);

    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="bg-white aspect-square max-sm:rounded-md sm:aspect-video sm:w-[calc(100%-50px)] max-w-[820px] overflow-hidden px-6">
        <Image
          src={NewsLetterImage}
          alt="NewsLetterImage"
          fill
          quality={100}
          priority
          className="object-cover absolute -z-10"
        />
        <div className="h-full w-full  sm:max-w-[60%]  absolute z-10 flex flex-col items-start justify-center px-10">
          <p className="uppercase font-medium text-lg">
            Get up to
            <span className="text-primary font-bold ml-3">25% OFF</span>
          </p>
          <h5 className="font-bold text-3xl capitalize my-2">
            Sign up to Shopping Cart
          </h5>

          <p className="text-gray-500 text-sm">
            Subscribe to the ShoppingCart market newsletter to receive updates
            on special offers.
          </p>
          <div className="rounded-full sm:overflow-hidden sm:border sm:border-gray-500 mt-4 flex sm:items-center max-sm:flex-col w-full">
            <input type="email" placeholder="Enter your email" className="w-full h-12 sm:h-full border border-gray-500 max-sm:mb-2 max-sm:rounded-full sm:border-none outline-none ring-0 bg-transparent px-4"/>
            <button className="max-sm:rounded-full py-3  sm:py-2 px-4 uppercase  bg-primary text-white font-semibold ">Submit</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsLetter;
