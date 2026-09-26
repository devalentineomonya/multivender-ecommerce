"use client";

import React, { forwardRef, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { BiUserCheck, BiShoppingBag, BiShieldQuarter } from "react-icons/bi";
import { SiApple, SiSamsung, SiNike } from "react-icons/si";
import logo from "@/public/images/logo.svg";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; title?: string }
>(({ className, children, title }, ref) => {
  return (
    <div
      ref={ref}
      title={title}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-2.5 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] transition-transform hover:scale-110",
        className
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

const AnimatedIcons = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full max-w-[480px] items-center justify-center overflow-hidden p-8"
      ref={containerRef}
    >
      <div className="flex size-full flex-col items-stretch justify-between gap-12">
        {/* Top Row: User to Platform to Brand */}
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref} className="border-emerald-200 text-emerald-700 bg-emerald-50/50" title="Verified Shopper">
            <BiUserCheck className="size-6" />
          </Circle>
          <Circle ref={div5Ref} className="border-gray-300 text-black hover:border-black" title="Apple Authorized Store">
            <SiApple className="size-5" />
          </Circle>
        </div>

        {/* Middle Row: Product to Central Platform Logo to Brand */}
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref} className="border-amber-200 text-amber-700 bg-amber-50/50" title="Marketplace Cart & Products">
            <BiShoppingBag className="size-6" />
          </Circle>

          {/* Centered ShoppingCart Logo */}
          <Circle
            ref={div4Ref}
            className="size-20 border-primary bg-primary/10 shadow-lg ring-4 ring-primary/20 p-3"
            title="ShoppingCart Platform"
          >
            <Image
              src={logo}
              alt="ShoppingCart Logo"
              className="w-full h-auto object-contain"
            />
          </Circle>

          <Circle ref={div6Ref} className="border-blue-200 text-[#1428a0]" title="Samsung Official Partner">
            <SiSamsung className="size-7" />
          </Circle>
        </div>

        {/* Bottom Row: Trust & Security to Brand */}
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref} className="border-teal-200 text-teal-700 bg-teal-50/50" title="Secure Payment & Protection">
            <BiShieldQuarter className="size-6" />
          </Circle>
          <Circle ref={div7Ref} className="border-black/20 text-black" title="Nike Official Partner">
            <SiNike className="size-6" />
          </Circle>
        </div>
      </div>

      {/* Animated Beams: Connecting Users & Products on Left to Centered Platform */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-60}
        endYOffset={-8}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={60}
        endYOffset={8}
      />

      {/* Animated Beams: Connecting Centered Platform to Partner Brands on Right */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-60}
        endYOffset={-8}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={60}
        endYOffset={8}
        reverse
      />
    </div>
  );
};

export default AnimatedIcons;
