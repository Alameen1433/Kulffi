"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Header from "@/components/sections/Header";
import CartDrawer from "@/components/shared/CartDrawer";
import OrderTracker from "@/components/orders/OrderTracker";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

function OrdersContent() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <Header />

      <main className="pt-24 pb-16 px-4 md:pt-28 md:pb-20 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb / Back */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#A31D1D]/60 hover:text-[#A31D1D] transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Page Header */}
          <div ref={headerRef} className="mb-8 md:mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-[#A31D1D] flex items-center justify-center shadow-[3px_3px_0_#2A1810]">
                <Package className="h-5 w-5 text-[#FCE9D5]" />
              </div>
              <h1 className="font-blenny text-[2rem] leading-none md:text-4xl text-[#A31D1D]">
                Track Orders
              </h1>
            </div>
            <p className="text-sm text-[#A31D1D]/60 md:ml-[52px]">
              View your order history and track delivery status in real-time.
            </p>
          </div>

          {/* Order Tracker */}
          <ErrorBoundary>
            <OrderTracker />
          </ErrorBoundary>
        </div>
      </main>

      <CartDrawer />
    </div>
  );
}

export default function OrdersPage() {
  return <OrdersContent />;
}
