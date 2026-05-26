"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flower2 } from "lucide-react";
import Marquee from "@/components/sections/Marquee";

interface HeroProps {
  loaded?: boolean;
}

export default function Hero({ loaded = false }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const marqueeWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  // ── Intro animation ──
  useEffect(() => {
    if (!loaded) return;

    const img = imgRef.current;
    const content = contentRef.current;

    const introTl = gsap.timeline({ delay: 0.1 });

    if (img) {
      gsap.set(img, { scale: 1.05 });
      introTl.to(img, { scale: 1, duration: 2.5, ease: "power3.out" }, 0);
    }

    if (content) {
      const elements = gsap.utils.toArray(content.children);
      gsap.set(elements, { autoAlpha: 0, y: 30 });
      introTl.to(
        elements,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.1
      );
    }

    const badge = badgeRef.current;
    if (badge) {
      gsap.set(badge, { autoAlpha: 0, scale: 0.8, rotate: -10 });
      introTl.to(badge, { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.2, ease: "back.out(1.7)" }, 0.8);
    }

    return () => {
      introTl.kill();
    };
  }, [loaded]);

  // ── Scroll-driven mask / marquee effect ──
  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const imageWrap = imageWrapRef.current;
    const img = imgRef.current;
    const overlay = overlayRef.current;
    const marqueeWrap = marqueeWrapRef.current;

    if (!section || !inner || !imageWrap || !img || !marqueeWrap) return;

    const triggers: ScrollTrigger[] = [];
    const mm = gsap.matchMedia();

    mm.add("(min-width: 900px)", () => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: inner,
          start: "top top",
          end: "+=120%",
          pin: inner,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      if (scrollTl.scrollTrigger) triggers.push(scrollTl.scrollTrigger);

      scrollTl.to(img, { scale: 1.25, ease: "none" }, 0);
      scrollTl.to(
        imageWrap,
        { clipPath: "inset(12% 27.5% 12% 27.5% round 24px)", ease: "none" },
        0
      );
      if (overlay) {
        scrollTl.to(overlay, { opacity: 0, ease: "none" }, 0);
      }

      // Fade out text content with upward slide
      const content = contentRef.current;
      if (content) {
        scrollTl.to(content.children, { autoAlpha: 0, y: -100, stagger: 0.05, ease: "power2.inOut" }, 0);
      }

      // Fade out badge quickly
      const badge = badgeRef.current;
      if (badge) {
        scrollTl.to(badge, { autoAlpha: 0, ease: "power2.in" }, 0);
      }

      // Marquee slides up from below
      scrollTl.fromTo(marqueeWrap, { yPercent: 100 }, { yPercent: 0, ease: "none" }, 0);

      return () => {
        scrollTl.kill();
        if (scrollTl.scrollTrigger) scrollTl.scrollTrigger.kill();
      };
    });

    mm.add("(max-width: 899px)", () => {
      const mobileTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.55,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      if (mobileTl.scrollTrigger) triggers.push(mobileTl.scrollTrigger);

      mobileTl.to(img, { scale: 1.1, ease: "none" }, 0);
      mobileTl.to(
        imageWrap,
        { clipPath: "inset(10% 8% 18% 8% round 22px)", ease: "none" },
        0
      );
      if (overlay) {
        mobileTl.to(overlay, { opacity: 0.08, ease: "none" }, 0);
      }

      // Fade out text content with upward slide
      const contentMob = contentRef.current;
      if (contentMob) {
        mobileTl.to(contentMob.children, { autoAlpha: 0, y: -80, stagger: 0.05, ease: "power2.inOut" }, 0);
      }

      // Fade out badge quickly
      const badgeMob = badgeRef.current;
      if (badgeMob) {
        mobileTl.to(badgeMob, { autoAlpha: 0, ease: "power2.in" }, 0);
      }

      mobileTl.fromTo(marqueeWrap, { yPercent: 100 }, { yPercent: 0, ease: "none" }, 0);

      return () => {
        mobileTl.kill();
        if (mobileTl.scrollTrigger) mobileTl.scrollTrigger.kill();
      };
    });

    return () => {
      mm.revert();
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F5E6D3]"
    >
      <div ref={innerRef} className="relative h-screen-safe min-h-[680px] w-full overflow-hidden bg-[#F5E6D3] md:h-screen md:min-h-0">
        {/* Marquee background (moves up during scroll) */}
        <div ref={marqueeWrapRef} className="absolute inset-0 z-0 will-change-transform">
          <Marquee variant="background" />
        </div>

        {/* Image with clip-path mask */}
        <div
          ref={imageWrapRef}
          className="absolute inset-0 z-10 will-change-[clip-path]"
          style={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        >
            <img
              ref={imgRef}
              src="/images/hero.webp"
              alt="Woman enjoying ice cream"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{ transform: "scale(1)" }}
              fetchPriority="high"
            />
            <div
              ref={overlayRef}
              className="absolute inset-0 bg-gradient-to-r from-[#2A1810]/70 via-[#2A1810]/30 to-transparent"
              style={{ opacity: 0.45 }}
            />
          </div>

        {/* Content Container (sits above the image) */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between pt-24 pb-8 pointer-events-none md:pt-28 md:pb-0 [&>*]:pointer-events-auto">
          {/* Main Hero Content */}
          <div className="relative flex-grow flex items-center px-4 md:px-10 lg:px-16">
        <div className="w-full max-w-7xl ml-0 mr-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-12 mt-4 md:mt-0">

          {/* Left Content */}
          <div ref={contentRef} className="max-w-[22rem] text-cream sm:max-w-xl">
            {/* Small Label */}
            <div className="flex items-center gap-2.5 mb-6 md:mb-8 group select-none">
              <span className="text-[9px] md:text-[11px] font-bold tracking-[0.28em] md:tracking-[0.35em] uppercase text-cream/90 transition-all duration-500 ease-out group-hover:tracking-[0.32em] md:group-hover:tracking-[0.4em] group-hover:text-cream">
                Scoops of Happiness
              </span>
              <div className="flex items-center gap-4">
                <Flower2 
                  size={14} 
                  strokeWidth={2.5}
                  className="text-[#A31D1D] transition-transform duration-1000 ease-in-out group-hover:rotate-180" 
                />
                <div className="h-[2px] w-10 bg-[#A31D1D] transition-all duration-500 group-hover:w-14 md:w-14 md:group-hover:w-20" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-[3.15rem] md:text-7xl lg:text-[6rem] leading-[1.02] mb-7 md:mb-8 font-serif">
              Made to <br />
              <span className="font-script text-[#A31D1D] lowercase text-[4.75rem] md:text-[7rem] lg:text-[9rem] leading-[0.72] inline-block -ml-1 md:-ml-2 -rotate-1 mt-1">brighten</span>
              <br />
              your day<span className="text-[#A31D1D]">.</span>
            </h1>

            {/* Paragraph */}
            <p className="text-[13px] md:text-base text-cream/90 max-w-[20rem] md:max-w-md mb-8 md:mb-10 leading-relaxed font-sans">
              From tropical mango to timeless classics, our ice creams are made with real ingredients and flavors that feel like home.
            </p>
          </div>


        </div>
      </div>


        </div>{/* end Content Container */}

        {/* Floating Badge */}
        <div ref={badgeRef} className="absolute bottom-5 right-5 md:bottom-12 md:right-12 z-30 pointer-events-none">
          <img
            src="/images/badge.webp"
            alt="Quality Seal"
            className="w-20 h-20 md:w-40 md:h-40 object-contain drop-shadow-xl"
          />
        </div>
      </div>{/* end inner */}
    </section>
  );
}
