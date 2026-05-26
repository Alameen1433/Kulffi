"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useCart } from "@/hooks/useCart";
import { X, ShoppingBag } from "lucide-react";

const CheckoutFlow = dynamic(() => import("@/components/checkout/CheckoutFlow"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 rounded-full border-[3px] border-[#A31D1D]/20 border-t-[#A31D1D] animate-spin" />
    </div>
  ),
});

export default function CartDrawer() {
  const { isOpen, setIsOpen, totalCount, resetCheckout } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (overlayRef.current) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      }
      if (drawerRef.current) {
        gsap.fromTo(drawerRef.current, { x: "100%" }, { x: "0%", duration: 0.4, ease: "power3.out" });
        window.setTimeout(() => {
          if (drawerRef.current) gsap.set(drawerRef.current, { x: "0%" });
        }, 450);
      }
    } else {
      document.body.style.overflow = "";
    }
    const overlay = overlayRef.current;
    const drawer = drawerRef.current;
    return () => {
      document.body.style.overflow = "";
      if (overlay) gsap.killTweensOf(overlay);
      if (drawer) gsap.killTweensOf(drawer);
    };
  }, [isOpen]);

  const closeDrawer = () => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" });
    }
    if (drawerRef.current) {
      gsap.to(drawerRef.current, {
        x: "100%",
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => {
          setIsOpen(false);
          resetCheckout();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[#2A1810]/60 backdrop-blur-sm cursor-pointer"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full max-w-[520px] bg-[#FCE9D5] shadow-[-12px_0_40px_rgba(42,24,16,0.25)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b-2 border-[#A31D1D]/15 shrink-0 md:px-6 md:py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-[#A31D1D]" strokeWidth={2} />
            <h2 className="font-display font-bold text-base md:text-lg uppercase tracking-widest text-[#A31D1D]">
              Your Cart
            </h2>
            <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-full bg-[#A31D1D] text-[#FCE9D5] text-[11px] font-bold">
              {totalCount}
            </span>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="group flex items-center justify-center h-10 w-10 rounded-full border-2 border-[#A31D1D] text-[#A31D1D] transition-all duration-300 hover:bg-[#A31D1D] hover:text-[#FCE9D5] hover:rotate-90"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Checkout Flow */}
        <div className="flex-1 overflow-hidden min-h-0">
          <CheckoutFlow />
        </div>
      </div>
    </div>
  );
}
