"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";

const featuredFlavors = [
  {
    id: "pistachio",
    name: "PISTACHIO",
    weight: "80g",
    price: 7.5,
    image: "/images/ice_cream_bar.webp",
    desc: "Sicilian pistachios, rich chocolate coating.",
  },
  {
    id: "alphonso",
    name: "ALPHONSO",
    weight: "85g",
    price: 6.5,
    image: "/images/mango_bar.webp",
    desc: "Ratnagiri Alphonso mango, raw perfection.",
  },
  {
    id: "dark-choc",
    name: "DARK CHOC",
    weight: "95g",
    price: 8.0,
    image: "/images/dark_choc_bar.webp",
    desc: "Belgian 70% cacao, sea salt flakes.",
  },
  {
    id: "saffron-rose",
    name: "SAFFRON ROSE",
    weight: "80g",
    price: 7.0,
    image: "/images/saffron.webp",
    desc: "Kashmiri saffron threads, dried rose petals.",
  },
  {
    id: "malai-almond",
    name: "MALAI ALMOND",
    weight: "80g",
    price: 6.5,
    image: "/images/malai.webp",
    desc: "Reduced milk cream, crushed almonds.",
  },
  {
    id: "filter-kaapi",
    name: "FILTER KAAPI",
    weight: "85g",
    price: 6.0,
    image: "/images/coffee.webp",
    desc: "South Indian filter coffee, chicory blend.",
  },
  {
    id: "coco-choc",
    name: "COCO-CHOC",
    weight: "85g",
    price: 6.5,
    image: "/images/coconut.webp",
    desc: "Tender coconut, half chocolate dip.",
  },
  {
    id: "honey-fig",
    name: "HONEY FIG",
    weight: "90g",
    price: 7.5,
    image: "/images/fig.webp",
    desc: "Fresh figs soaked in wild forest honey.",
  },
];

function FlavorCard({ flavor }: { flavor: (typeof featuredFlavors)[0] }) {
  const { addItem, items, updateQuantity } = useCart();
  const inCart = items.find((i) => i.id === flavor.id);

  const handleAdd = () => {
    addItem({
      id: flavor.id,
      name: flavor.name,
      price: flavor.price,
      weight: flavor.weight,
      image: flavor.image,
    });
  };

  return (
    <div className="group relative flex flex-col h-full bg-[#FCE9D5] border-[3px] md:border-4 border-[#A31D1D] shadow-[6px_6px_0_#A31D1D] md:shadow-[8px_8px_0_#A31D1D] rounded-lg md:rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[12px_12px_0_#A31D1D] hover:-rotate-1">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden border-b-4 border-[#A31D1D]">
        <Image
          src={flavor.image}
          alt={flavor.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Weight Badge */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-[#A31D1D] text-[#FCE9D5] px-2.5 md:px-3 py-1 font-display font-bold text-xs md:text-sm tracking-wider border-2 border-[#A31D1D] shadow-[2px_2px_0_#2A1810] rotate-3">
          {flavor.weight}
        </div>
        {/* Price Badge */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-[#FCE9D5] text-[#A31D1D] px-2.5 md:px-3 py-1 font-display font-bold text-xs md:text-sm tracking-wider border-2 border-[#A31D1D] shadow-[2px_2px_0_#2A1810] -rotate-2">
          ${flavor.price.toFixed(2)}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 md:p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-[1.35rem] md:text-[26px] leading-none uppercase tracking-wider text-[#A31D1D] drop-shadow-[1px_1px_0_rgba(163,29,29,0.2)]">
            {flavor.name}
          </h3>
          <p className="mt-3 text-sm md:text-base font-medium text-[#A31D1D]/80 leading-relaxed md:min-h-[48px]">
            {flavor.desc}
          </p>
        </div>

        {/* Cart Action */}
        {inCart ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(flavor.id, inCart.quantity - 1)}
                aria-label={`Decrease ${flavor.name} quantity`}
                className="flex items-center justify-center h-9 w-9 rounded-full border-2 border-[#A31D1D] text-[#A31D1D] transition-all duration-200 hover:bg-[#A31D1D] hover:text-[#FCE9D5] active:scale-95"
              >
                <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
              <span className="w-10 text-center font-display font-bold text-base text-[#A31D1D]">
                {inCart.quantity}
              </span>
              <button
                onClick={() => updateQuantity(flavor.id, inCart.quantity + 1)}
                aria-label={`Increase ${flavor.name} quantity`}
                className="flex items-center justify-center h-9 w-9 rounded-full border-2 border-[#A31D1D] text-[#A31D1D] transition-all duration-200 hover:bg-[#A31D1D] hover:text-[#FCE9D5] active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </div>
            <span className="font-display font-bold text-sm text-[#A31D1D]">
              ${(flavor.price * inCart.quantity).toFixed(2)}
            </span>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="mt-2 w-full min-h-12 py-3 bg-[#FCE9D5] border-2 border-[#A31D1D] rounded-full text-[#A31D1D] font-display font-bold text-[12px] md:text-[13px] uppercase tracking-widest shadow-[3px_3px_0_#A31D1D] md:shadow-[4px_4px_0_#A31D1D] transition-all duration-300 hover:bg-[#A31D1D] hover:text-[#FCE9D5] hover:-translate-y-1 hover:shadow-[6px_6px_0_#2A1810] active:translate-y-[2px] active:shadow-[2px_2px_0_#2A1810] flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={2} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default function Flavors() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll(".split-word");
      const tl = gsap.fromTo(
        words,
        { y: "100%", opacity: 0, rotate: -10 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
      tweens.push(tl);
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    const cards = sectionRef.current?.querySelectorAll(".flavor-card");
    if (cards) {
      const tl = gsap.fromTo(
        cards,
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
      tweens.push(tl);
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    return () => {
      tweens.forEach((t) => t.kill());
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      id="flavors"
      ref={sectionRef}
      className="bg-[#FDF0DE] py-20 md:py-40 relative overflow-hidden"
    >
      <div className="px-6 md:px-12 mx-auto max-w-[1400px]">
        {/* Header Area */}
        <div className="mb-12 md:mb-24">
          <h2
            ref={headlineRef}
            className="font-blenny text-[clamp(2.75rem,16vw,6rem)] leading-[0.88] tracking-tighter text-[#A31D1D] drop-shadow-[3px_3px_0_#FCE9D5]"
          >
            <span className="block overflow-hidden py-1">
              <span className="split-word inline-block origin-bottom-left">THE</span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="split-word inline-block origin-bottom-left text-[#FCE9D5] drop-shadow-[4px_4px_0_#A31D1D]">KULFFI</span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="split-word inline-block origin-bottom-left">COLLECTION.</span>
            </span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-9 md:gap-10 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {featuredFlavors.map((flavor) => (
            <div key={flavor.id} className="flavor-card h-full">
              <FlavorCard flavor={flavor} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
