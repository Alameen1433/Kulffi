"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useCart } from "@/hooks/useCart";
import {
  Minus,
  Plus,
  Trash2,
  ChevronLeft,
  CreditCard,
  Truck,
  Check,
  ShieldCheck,
  MapPin,
  Package,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

function StepIndicator({
  steps,
  current,
}: {
  steps: { id: string; label: string; icon: React.ReactNode }[];
  current: number;
}) {
  return (
    <div className="flex items-center justify-center gap-1.5 px-3 py-3 border-b-2 border-[#A31D1D]/10 md:gap-2 md:px-6 md:py-4">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full border-2 transition-all duration-300 ${
              i < current
                ? "bg-[#A31D1D] border-[#A31D1D] text-[#FCE9D5]"
                : i === current
                ? "bg-[#A31D1D] border-[#A31D1D] text-[#FCE9D5]"
                : "bg-transparent border-[#A31D1D]/25 text-[#A31D1D]/40"
            }`}
          >
            {i < current ? (
              <Check className="h-4 w-4" strokeWidth={3} />
            ) : (
              <span className="text-xs font-bold">{i + 1}</span>
            )}
          </div>
          <span
            className={`hidden sm:block text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
              i <= current ? "text-[#A31D1D]" : "text-[#A31D1D]/40"
            }`}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`w-6 h-[2px] rounded-full transition-colors duration-300 ${
                i < current ? "bg-[#A31D1D]" : "bg-[#A31D1D]/15"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CartStep({ onNext }: { onNext: () => void }) {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.querySelectorAll(".cart-item"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-6">
        <div className="h-20 w-20 rounded-full border-2 border-[#A31D1D]/20 flex items-center justify-center">
          <Package className="h-8 w-8 text-[#A31D1D]/30" strokeWidth={1.5} />
        </div>
        <p className="text-[#A31D1D]/60 font-medium text-sm">Your cart is empty.</p>

      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={contentRef} className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
        <div className="flex flex-col gap-4 md:gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="cart-item group flex gap-3 md:gap-4 p-3 rounded-xl border-2 border-[#A31D1D]/10 bg-white/50 transition-all duration-300 hover:border-[#A31D1D]/30 hover:shadow-[4px_4px_0_#A31D1D]/10"
            >
              <div className="relative h-[4.5rem] w-[4.5rem] md:h-20 md:w-20 shrink-0 overflow-hidden rounded-lg border-2 border-[#A31D1D]/10">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between py-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[#A31D1D]">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#A31D1D]/50 font-medium mt-0.5">{item.weight}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="text-[#A31D1D]/30 hover:text-[#A31D1D] transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Decrease ${item.name} quantity`}
                      className="flex items-center justify-center h-7 w-7 rounded-full border-2 border-[#A31D1D] text-[#A31D1D] transition-all duration-200 hover:bg-[#A31D1D] hover:text-[#FCE9D5] active:scale-95"
                    >
                      <Minus className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                    <span className="w-8 text-center font-display font-bold text-sm text-[#A31D1D]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Increase ${item.name} quantity`}
                      className="flex items-center justify-center h-7 w-7 rounded-full border-2 border-[#A31D1D] text-[#A31D1D] transition-all duration-200 hover:bg-[#A31D1D] hover:text-[#FCE9D5] active:scale-95"
                    >
                      <Plus className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                  </div>
                  <span className="font-display font-bold text-sm text-[#A31D1D]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="self-start text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/40 hover:text-[#A31D1D] transition-colors duration-200 underline underline-offset-4"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
      <div className="border-t-2 border-[#A31D1D]/15 px-4 py-5 bg-[#FCE9D5] pb-safe md:px-6 md:py-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#A31D1D]/70">Subtotal</span>
          <span className="font-display font-bold text-lg text-[#A31D1D]">${totalPrice.toFixed(2)}</span>
        </div>
        <p className="text-[11px] text-[#A31D1D]/40 mb-5">Shipping & taxes calculated at checkout.</p>
        <button
          onClick={onNext}
          className="w-full py-4 bg-[#A31D1D] text-[#FCE9D5] font-display font-bold text-sm uppercase tracking-[0.2em] rounded-full shadow-[4px_4px_0_#2A1810] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_#2A1810] active:translate-y-[2px] active:shadow-[2px_2px_0_#2A1810]"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

function ShippingStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { shippingInfo, setShippingInfo } = useCart();
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.querySelectorAll(".field-group"),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const required = ["fullName", "address", "city", "state", "zip", "phone", "email"];
    const newErrors: Record<string, boolean> = {};
    let valid = true;
    required.forEach((key) => {
      const el = form.elements.namedItem(key);
      if (!el || !(el as HTMLInputElement).value.trim()) {
        newErrors[key] = true;
        valid = false;
      }
    });
    setErrors(newErrors);
    if (valid) onNext();
  };

  const inputClass = (key: string) =>
    `w-full bg-transparent border-b-2 ${
      errors[key] ? "border-red-500" : "border-[#A31D1D]/15"
    } py-3 text-[#A31D1D] text-sm font-medium outline-none transition-colors duration-300 focus:border-[#A31D1D] placeholder:text-[#A31D1D]/30`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
        <h3 className="font-display font-bold text-lg uppercase tracking-widest text-[#A31D1D] mb-6 flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Address
        </h3>
        <div className="flex flex-col gap-5">
          <div className="field-group">
            <label htmlFor="shipping-fullName" className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
              Full Name *
            </label>
            <input
              id="shipping-fullName"
              name="fullName"
              value={shippingInfo.fullName}
              onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
              placeholder="Jane Doe"
              className={inputClass("fullName")}
            />
          </div>
          <div className="field-group">
            <label htmlFor="shipping-address" className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
              Street Address *
            </label>
            <input
              id="shipping-address"
              name="address"
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
              placeholder="123 Kulffi Lane"
              className={inputClass("address")}
            />
          </div>
          <div className="field-group grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="shipping-city" className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                City *
              </label>
              <input
                id="shipping-city"
                name="city"
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                placeholder="Mumbai"
                className={inputClass("city")}
              />
            </div>
            <div>
              <label htmlFor="shipping-state" className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                State *
              </label>
              <input
                id="shipping-state"
                name="state"
                value={shippingInfo.state}
                onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                placeholder="Maharashtra"
                className={inputClass("state")}
              />
            </div>
          </div>
          <div className="field-group grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="shipping-zip" className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                ZIP / Postal *
              </label>
              <input
                id="shipping-zip"
                name="zip"
                value={shippingInfo.zip}
                onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                placeholder="400001"
                className={inputClass("zip")}
              />
            </div>
            <div>
              <label htmlFor="shipping-country" className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                Country
              </label>
              <input
                id="shipping-country"
                name="country"
                value={shippingInfo.country}
                onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                placeholder="India"
                className={inputClass("country")}
              />
            </div>
          </div>
          <div className="field-group grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="shipping-phone" className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                Phone *
              </label>
              <input
                id="shipping-phone"
                name="phone"
                type="tel"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className={inputClass("phone")}
              />
            </div>
            <div>
              <label htmlFor="shipping-email" className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                Email *
              </label>
              <input
                id="shipping-email"
                name="email"
                type="email"
                value={shippingInfo.email}
                onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                placeholder="jane@example.com"
                className={inputClass("email")}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-[#A31D1D]/15 px-4 py-5 bg-[#FCE9D5] flex items-center gap-3 pb-safe md:px-6 md:py-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center h-12 w-12 shrink-0 rounded-full border-2 border-[#A31D1D] text-[#A31D1D] transition-all duration-300 hover:bg-[#A31D1D] hover:text-[#FCE9D5]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="submit"
          className="flex-1 min-h-12 py-3.5 bg-[#A31D1D] text-[#FCE9D5] font-display font-bold text-xs md:text-sm uppercase tracking-[0.16em] md:tracking-[0.2em] rounded-full shadow-[3px_3px_0_#2A1810] md:shadow-[4px_4px_0_#2A1810] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_#2A1810] active:translate-y-[2px] active:shadow-[2px_2px_0_#2A1810]"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}

function PaymentStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { paymentInfo, setPaymentInfo, totalPrice } = useCart();
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.querySelectorAll(".field-group, .method-tab"),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [paymentInfo.method]);

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const isValidUpi = (id: string) => /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/.test(id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let valid = true;

    if (paymentInfo.method === "card") {
      const required = ["cardNumber", "expiry", "cvc", "nameOnCard"];
      required.forEach((key) => {
        const val = paymentInfo[key as keyof typeof paymentInfo];
        if (!val || !String(val).trim()) {
          newErrors[key] = true;
          valid = false;
        }
      });
    } else if (paymentInfo.method === "upi") {
      if (!paymentInfo.upiId.trim() || !isValidUpi(paymentInfo.upiId.trim())) {
        newErrors.upiId = true;
        valid = false;
      }
    } else if (paymentInfo.method === "netbanking") {
      if (!paymentInfo.bankName.trim()) {
        newErrors.bankName = true;
        valid = false;
      }
    } else if (paymentInfo.method === "wallet") {
      if (!paymentInfo.walletProvider.trim()) {
        newErrors.walletProvider = true;
        valid = false;
      }
    }

    setErrors(newErrors);
    if (valid) onNext();
  };

  const inputClass = (key: string) =>
    `w-full bg-transparent border-b-2 ${
      errors[key] ? "border-red-500" : "border-[#A31D1D]/15"
    } py-3 text-[#A31D1D] text-sm font-medium outline-none transition-colors duration-300 focus:border-[#A31D1D] placeholder:text-[#A31D1D]/30`;

  const selectClass = (key: string) =>
    `w-full bg-transparent border-b-2 ${
      errors[key] ? "border-red-500" : "border-[#A31D1D]/15"
    } py-3 text-[#A31D1D] text-sm font-medium outline-none transition-colors duration-300 focus:border-[#A31D1D] placeholder:text-[#A31D1D]/30`;

  const methodButtonClass = (method: string) =>
    `min-h-12 py-2.5 px-2 rounded-xl border-2 font-display font-bold text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-widest leading-tight transition-all duration-300 ${
      paymentInfo.method === method
        ? "bg-[#A31D1D] border-[#A31D1D] text-[#FCE9D5] shadow-[3px_3px_0_#2A1810]"
        : "bg-transparent border-[#A31D1D]/20 text-[#A31D1D]/60 hover:border-[#A31D1D]/40"
    }`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
        <h3 className="font-display font-bold text-lg uppercase tracking-widest text-[#A31D1D] mb-6 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </h3>

        {/* Method Tabs */}
        <div className="method-tab grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          <button type="button" onClick={() => setPaymentInfo({ ...paymentInfo, method: "card" })} className={methodButtonClass("card")}>
            Card
          </button>
          <button type="button" onClick={() => setPaymentInfo({ ...paymentInfo, method: "upi" })} className={methodButtonClass("upi")}>
            UPI
          </button>
          <button type="button" onClick={() => setPaymentInfo({ ...paymentInfo, method: "netbanking" })} className={methodButtonClass("netbanking")}>
            Net Banking
          </button>
          <button type="button" onClick={() => setPaymentInfo({ ...paymentInfo, method: "wallet" })} className={methodButtonClass("wallet")}>
            Wallet
          </button>
          <button type="button" onClick={() => setPaymentInfo({ ...paymentInfo, method: "cod" })} className={methodButtonClass("cod")}>
            Cash on Delivery
          </button>
        </div>

        {paymentInfo.method === "card" && (
          <>
            {/* Mock Card Visual */}
            <div className="mb-6 p-5 rounded-2xl bg-[#A31D1D] text-[#FCE9D5] shadow-[6px_6px_0_#2A1810] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-70">Kulffi Debit</div>
                  <ShieldCheck className="h-5 w-5 opacity-70" />
                </div>
                <div className="font-mono text-lg tracking-widest mb-4">
                  {paymentInfo.cardNumber || "•••• •••• •••• ••••"}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">Card Holder</div>
                    <div className="text-sm font-medium truncate max-w-[160px]">
                      {paymentInfo.nameOnCard || "YOUR NAME"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">Expires</div>
                    <div className="text-sm font-medium">{paymentInfo.expiry || "MM/YY"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="field-group">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                  Name on Card *
                </label>
                <input
                  value={paymentInfo.nameOnCard}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
                  placeholder="Jane Doe"
                  className={inputClass("nameOnCard")}
                />
              </div>
              <div className="field-group">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                  Card Number *
                </label>
                <input
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: formatCard(e.target.value) })}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className={inputClass("cardNumber")}
                />
              </div>
            <div className="field-group grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                    Expiry *
                  </label>
                  <input
                    value={paymentInfo.expiry}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: formatExpiry(e.target.value) })}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={inputClass("expiry")}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                    CVC *
                  </label>
                  <input
                    value={paymentInfo.cvc}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                    placeholder="123"
                    maxLength={3}
                    className={inputClass("cvc")}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {paymentInfo.method === "upi" && (
          <div className="flex flex-col gap-5">
            {/* UPI Visual */}
            <div className="mb-2 p-5 rounded-2xl bg-[#FCE9D5] border-2 border-[#A31D1D] shadow-[6px_6px_0_#2A1810] relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-[#A31D1D] flex items-center justify-center shrink-0">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FCE9D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20M7 7l10 10M7 17L17 7"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[#A31D1D]/60 mb-0.5">Pay via UPI</div>
                  <div className="font-display font-bold text-lg text-[#A31D1D]">
                    {paymentInfo.upiId || "yourname@upi"}
                  </div>
                </div>
              </div>
            </div>

            <div className="field-group">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                UPI ID *
              </label>
              <input
                value={paymentInfo.upiId}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, upiId: e.target.value })}
                placeholder="yourname@upi / yourname@okaxis"
                className={inputClass("upiId")}
              />
              {errors.upiId && (
                <p className="mt-1.5 text-[11px] text-red-500 font-medium">Please enter a valid UPI ID (e.g. name@upi)</p>
              )}
            </div>

            <div className="p-4 rounded-xl border-2 border-[#A31D1D]/10 bg-white/40">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-2">Supported UPI Apps</div>
              <div className="flex flex-wrap gap-2">
                {["Google Pay", "PhonePe", "Paytm", "BHIM", "Amazon Pay", "Cred"].map((app) => (
                  <span key={app} className="px-3 py-1.5 rounded-full border border-[#A31D1D]/15 text-[11px] font-medium text-[#A31D1D]/70 bg-white/60">
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {paymentInfo.method === "netbanking" && (
          <div className="flex flex-col gap-5">
            <div className="mb-2 p-5 rounded-2xl bg-[#FCE9D5] border-2 border-[#A31D1D] shadow-[6px_6px_0_#2A1810] relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-[#A31D1D] flex items-center justify-center shrink-0">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FCE9D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M4 18h16M5 18v-7l7-4 7 4v7M12 7V3"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[#A31D1D]/60 mb-0.5">Net Banking</div>
                  <div className="font-display font-bold text-lg text-[#A31D1D]">
                    {paymentInfo.bankName || "Select your bank"}
                  </div>
                </div>
              </div>
            </div>

            <div className="field-group">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                Select Bank *
              </label>
              <select
                value={paymentInfo.bankName}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                className={`${selectClass("bankName")} appearance-none cursor-pointer`}
              >
                <option value="" disabled className="text-[#A31D1D]/30">Choose your bank</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                <option value="Bank of Baroda">Bank of Baroda</option>
                <option value="Canara Bank">Canara Bank</option>
                <option value="Union Bank of India">Union Bank of India</option>
                <option value="IDFC First Bank">IDFC First Bank</option>
              </select>
              {errors.bankName && (
                <p className="mt-1.5 text-[11px] text-red-500 font-medium">Please select a bank</p>
              )}
            </div>

            <div className="p-4 rounded-xl border-2 border-[#A31D1D]/10 bg-white/40">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-2">How it works</div>
              <p className="text-xs text-[#A31D1D]/70 leading-relaxed">
                You will be redirected to your bank&apos;s secure net banking page to complete the payment. Your credentials are never shared with us.
              </p>
            </div>
          </div>
        )}

        {paymentInfo.method === "wallet" && (
          <div className="flex flex-col gap-5">
            <div className="mb-2 p-5 rounded-2xl bg-[#FCE9D5] border-2 border-[#A31D1D] shadow-[6px_6px_0_#2A1810] relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-[#A31D1D] flex items-center justify-center shrink-0">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FCE9D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[#A31D1D]/60 mb-0.5">Mobile Wallet</div>
                  <div className="font-display font-bold text-lg text-[#A31D1D]">
                    {paymentInfo.walletProvider || "Select wallet"}
                  </div>
                </div>
              </div>
            </div>

            <div className="field-group">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-1.5">
                Select Wallet *
              </label>
              <select
                value={paymentInfo.walletProvider}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, walletProvider: e.target.value })}
                className={`${selectClass("walletProvider")} appearance-none cursor-pointer`}
              >
                <option value="" disabled className="text-[#A31D1D]/30">Choose your wallet</option>
                <option value="Paytm">Paytm</option>
                <option value="PhonePe Wallet">PhonePe Wallet</option>
                <option value="Amazon Pay">Amazon Pay</option>
                <option value="Mobikwik">Mobikwik</option>
                <option value="Freecharge">Freecharge</option>
                <option value="JioMoney">JioMoney</option>
              </select>
              {errors.walletProvider && (
                <p className="mt-1.5 text-[11px] text-red-500 font-medium">Please select a wallet</p>
              )}
            </div>

            <div className="p-4 rounded-xl border-2 border-[#A31D1D]/10 bg-white/40">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-2">How it works</div>
              <p className="text-xs text-[#A31D1D]/70 leading-relaxed">
                You will receive a payment request on your selected wallet app. Complete the payment to confirm your order.
              </p>
            </div>
          </div>
        )}

        {paymentInfo.method === "cod" && (
          <div className="flex flex-col gap-5">
            <div className="mb-2 p-5 rounded-2xl bg-[#FCE9D5] border-2 border-[#A31D1D] shadow-[6px_6px_0_#2A1810] relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-[#A31D1D] flex items-center justify-center shrink-0">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FCE9D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10h16M4 14h16M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[#A31D1D]/60 mb-0.5">Cash on Delivery</div>
                  <div className="font-display font-bold text-lg text-[#A31D1D]">
                    Pay when you receive
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-[#A31D1D]/10 bg-white/40">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-2">Important Notes</div>
              <ul className="text-xs text-[#A31D1D]/70 leading-relaxed list-disc list-inside space-y-1">
                <li>Please keep exact change ready at the time of delivery.</li>
                <li>COD is available for orders up to $50.</li>
                <li>You will receive an OTP on delivery — share it with the delivery partner to confirm.</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-[11px] text-[#A31D1D]/40">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Your payment info is secure and encrypted.</span>
        </div>
      </div>
      <div className="border-t-2 border-[#A31D1D]/15 px-4 py-5 bg-[#FCE9D5] flex items-center gap-3 pb-safe md:px-6 md:py-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center h-12 w-12 shrink-0 rounded-full border-2 border-[#A31D1D] text-[#A31D1D] transition-all duration-300 hover:bg-[#A31D1D] hover:text-[#FCE9D5]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="submit"
          className="flex-1 min-h-12 py-3.5 bg-[#A31D1D] text-[#FCE9D5] font-display font-bold text-xs md:text-sm uppercase tracking-[0.14em] md:tracking-[0.2em] rounded-full shadow-[3px_3px_0_#2A1810] md:shadow-[4px_4px_0_#2A1810] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_#2A1810] active:translate-y-[2px] active:shadow-[2px_2px_0_#2A1810]"
        >
          Review Order — ${totalPrice.toFixed(2)}
        </button>
      </div>
    </form>
  );
}

function ReviewStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { items, shippingInfo, paymentInfo, totalPrice, completeCheckout } = useCart();
  const [placing, setPlacing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.querySelectorAll(".review-block"),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" }
      );
    }
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePlaceOrder = () => {
    setPlacing(true);
    timeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      completeCheckout();
      onNext();
      setPlacing(false);
    }, 1500);
  };

  const maskedCard = paymentInfo.cardNumber
    ? `•••• •••• •••• ${paymentInfo.cardNumber.slice(-4)}`
    : "•••• •••• •••• ••••";

  return (
    <div className="flex flex-col h-full">
      <div ref={contentRef} className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
        <h3 className="font-display font-bold text-lg uppercase tracking-widest text-[#A31D1D] mb-6 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Review Your Order
        </h3>

        {/* Items */}
        <div className="review-block mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60 mb-3">Items</div>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#A31D1D]/10">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover border border-[#A31D1D]/10" />
                  <div>
                    <div className="font-display font-bold text-xs uppercase tracking-wider text-[#A31D1D]">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#A31D1D]/50">Qty: {item.quantity}</div>
                  </div>
                </div>
                <span className="font-display font-bold text-sm text-[#A31D1D]">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping */}
        <div className="review-block mb-6 p-4 rounded-xl border-2 border-[#A31D1D]/10 bg-white/40">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-3.5 w-3.5 text-[#A31D1D]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60">Ship to</span>
          </div>
          <p className="text-sm font-medium text-[#A31D1D] leading-relaxed">
            {shippingInfo.fullName}
            <br />
            {shippingInfo.address}
            <br />
            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
            <br />
            {shippingInfo.country || "India"}
          </p>
        </div>

        {/* Payment */}
        <div className="review-block mb-6 p-4 rounded-xl border-2 border-[#A31D1D]/10 bg-white/40">
          <div className="flex items-center gap-2 mb-2">
            {paymentInfo.method === "card" ? (
              <CreditCard className="h-3.5 w-3.5 text-[#A31D1D]" />
            ) : paymentInfo.method === "upi" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A31D1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20M7 7l10 10M7 17L17 7"/>
              </svg>
            ) : paymentInfo.method === "netbanking" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A31D1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M4 18h16M5 18v-7l7-4 7 4v7M12 7V3"/>
              </svg>
            ) : paymentInfo.method === "wallet" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A31D1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A31D1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10h16M4 14h16M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/>
              </svg>
            )}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/60">
              {paymentInfo.method === "card" ? "Card Payment" : paymentInfo.method === "upi" ? "UPI Payment" : paymentInfo.method === "netbanking" ? "Net Banking" : paymentInfo.method === "wallet" ? "Wallet Payment" : "Cash on Delivery"}
            </span>
          </div>
          {paymentInfo.method === "card" ? (
            <>
              <p className="text-sm font-medium text-[#A31D1D]">{maskedCard}</p>
              <p className="text-[11px] text-[#A31D1D]/50">{paymentInfo.nameOnCard}</p>
            </>
          ) : paymentInfo.method === "upi" ? (
            <>
              <p className="text-sm font-medium text-[#A31D1D]">{paymentInfo.upiId}</p>
              <p className="text-[11px] text-[#A31D1D]/50">You will receive a payment request on your UPI app.</p>
            </>
          ) : paymentInfo.method === "netbanking" ? (
            <>
              <p className="text-sm font-medium text-[#A31D1D]">{paymentInfo.bankName}</p>
              <p className="text-[11px] text-[#A31D1D]/50">You will be redirected to your bank&apos;s net banking page.</p>
            </>
          ) : paymentInfo.method === "wallet" ? (
            <>
              <p className="text-sm font-medium text-[#A31D1D]">{paymentInfo.walletProvider}</p>
              <p className="text-[11px] text-[#A31D1D]/50">You will receive a payment request on your wallet app.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-[#A31D1D]">Cash on Delivery</p>
              <p className="text-[11px] text-[#A31D1D]/50">Pay with cash when your order is delivered.</p>
            </>
          )}
        </div>

        {/* Totals */}
        <div className="review-block space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#A31D1D]/60">Subtotal</span>
            <span className="font-medium text-[#A31D1D]">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#A31D1D]/60">Shipping</span>
            <span className="font-medium text-[#A31D1D]">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#A31D1D]/60">Tax</span>
            <span className="font-medium text-[#A31D1D]">Calculated</span>
          </div>
          <div className="flex justify-between pt-3 border-t-2 border-[#A31D1D]/10">
            <span className="font-display font-bold text-sm uppercase tracking-wider text-[#A31D1D]">Total</span>
            <span className="font-display font-bold text-lg text-[#A31D1D]">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-[#A31D1D]/15 px-4 py-5 bg-[#FCE9D5] flex items-center gap-3 pb-safe md:px-6 md:py-6">
        <button
          onClick={onBack}
          disabled={placing}
          className="flex items-center justify-center h-12 w-12 shrink-0 rounded-full border-2 border-[#A31D1D] text-[#A31D1D] transition-all duration-300 hover:bg-[#A31D1D] hover:text-[#FCE9D5] disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="flex-1 min-h-12 py-3.5 bg-[#A31D1D] text-[#FCE9D5] font-display font-bold text-xs md:text-sm uppercase tracking-[0.14em] md:tracking-[0.2em] rounded-full shadow-[3px_3px_0_#2A1810] md:shadow-[4px_4px_0_#2A1810] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_#2A1810] active:translate-y-[2px] active:shadow-[2px_2px_0_#2A1810] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {placing ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-[#FCE9D5]/30 border-t-[#FCE9D5] animate-spin" />
              Processing...
            </>
          ) : (
            <>Place Order — ${totalPrice.toFixed(2)}</>
          )}
        </button>
      </div>
    </div>
  );
}

function SuccessStep({ onClose }: { onClose: () => void }) {
  const { lastOrder, resetCheckout } = useCart();
  const checkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (checkRef.current) {
      gsap.fromTo(
        checkRef.current,
        { scale: 0, rotate: -45 },
        { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" }
      );
    }
  }, []);

  const handleClose = () => {
    resetCheckout();
    onClose();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div
        ref={checkRef}
        className="h-20 w-20 rounded-full bg-[#A31D1D] flex items-center justify-center mb-6 shadow-[6px_6px_0_#2A1810]"
      >
        <Check className="h-10 w-10 text-[#FCE9D5]" strokeWidth={3} />
      </div>
      <h3 className="font-display font-bold text-2xl uppercase tracking-widest text-[#A31D1D] mb-2">
        Order Confirmed
      </h3>
      <p className="text-sm text-[#A31D1D]/70 mb-1 max-w-[280px]">
        Thank you! Your kulffi is being handcrafted and will be on its way soon.
      </p>
      {lastOrder && (
        <div className="mt-4 mb-6 px-5 py-3 rounded-xl border-2 border-[#A31D1D]/15 bg-white/50">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A31D1D]/50 mb-1">Order ID</div>
          <div className="font-mono text-lg font-bold text-[#A31D1D]">{lastOrder.id}</div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/orders"
          onClick={handleClose}
          className="flex items-center gap-2 px-8 py-4 bg-[#FCE9D5] border-2 border-[#A31D1D] text-[#A31D1D] font-display font-bold text-sm uppercase tracking-[0.2em] rounded-full shadow-[4px_4px_0_#2A1810] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_#2A1810] active:translate-y-[2px] active:shadow-[2px_2px_0_#2A1810]"
        >
          Track Order
          <ExternalLink className="h-4 w-4" />
        </Link>
        <button
          onClick={handleClose}
          className="px-10 py-4 bg-[#A31D1D] text-[#FCE9D5] font-display font-bold text-sm uppercase tracking-[0.2em] rounded-full shadow-[4px_4px_0_#2A1810] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_#2A1810] active:translate-y-[2px] active:shadow-[2px_2px_0_#2A1810]"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default function CheckoutFlow() {
  const { checkoutStep, setCheckoutStep, resetCheckout, setIsOpen } = useCart();

  const steps = [
    { id: "cart", label: "Cart", icon: <Package className="h-3.5 w-3.5" /> },
    { id: "shipping", label: "Shipping", icon: <Truck className="h-3.5 w-3.5" /> },
    { id: "payment", label: "Payment", icon: <CreditCard className="h-3.5 w-3.5" /> },
    { id: "review", label: "Review", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  ];

  const stepIndex = ["cart", "shipping", "payment", "review", "success"].indexOf(checkoutStep);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => resetCheckout(), 400);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {checkoutStep !== "success" && (
        <StepIndicator steps={steps} current={stepIndex} />
      )}
      <div className="flex-1 overflow-hidden min-h-0">
        {checkoutStep === "cart" && <CartStep onNext={() => setCheckoutStep("shipping")} />}
        {checkoutStep === "shipping" && (
          <ShippingStep onNext={() => setCheckoutStep("payment")} onBack={() => setCheckoutStep("cart")} />
        )}
        {checkoutStep === "payment" && (
          <PaymentStep onNext={() => setCheckoutStep("review")} onBack={() => setCheckoutStep("shipping")} />
        )}
        {checkoutStep === "review" && (
          <ReviewStep
            onNext={() => setCheckoutStep("success")}
            onBack={() => setCheckoutStep("payment")}
          />
        )}
        {checkoutStep === "success" && <SuccessStep onClose={handleClose} />}
      </div>
    </div>
  );
}
