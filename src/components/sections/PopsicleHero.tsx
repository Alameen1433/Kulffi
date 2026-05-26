"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "@/components/sections/Marquee";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PopsicleHero({
  children,
}: {
  children?: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const curtain = curtainRef.current;
    const imageWrap = imageWrapRef.current;
    const img = imgRef.current;
    const overlay = overlayRef.current;

    if (!section || !inner || !curtain || !imageWrap || !img) return;

    const mm = gsap.matchMedia();

    const desktopAnimation = () => {
      gsap.set(curtain, { yPercent: 0 });
      gsap.set(img, { scale: 1 });
      gsap.set(imageWrap, { clipPath: "inset(0% 0% 0% 0% round 0px)" });
      if (overlay) gsap.set(overlay, { opacity: 0.45 });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      scrollTl.fromTo(img, { scale: 1 }, { scale: 1.25, ease: "none" }, 0);
      scrollTl.fromTo(
        imageWrap,
        { clipPath: "inset(0% 0% 0% 0% round 0px)" },
        { clipPath: "inset(12% 27.5% 12% 27.5% round 24px)", ease: "none" },
        0.15
      );
      if (overlay) {
        scrollTl.fromTo(overlay, { opacity: 0.45 }, { opacity: 0, ease: "none" }, 0.3);
      }
      scrollTl.to(curtain, { yPercent: -90, ease: "none" }, 0.5);

      return () => scrollTl.kill();
    };

    const mobileAnimation = () => {
      gsap.set(curtain, { yPercent: 0 });
      gsap.set(img, { scale: 1 });
      gsap.set(imageWrap, { clipPath: "inset(0% 0% 0% 0% round 0px)" });
      if (overlay) gsap.set(overlay, { opacity: 0.45 });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });

      scrollTl.fromTo(img, { scale: 1 }, { scale: 1.08, ease: "none" }, 0);
      scrollTl.fromTo(
        imageWrap,
        { clipPath: "inset(0% 0% 0% 0% round 0px)" },
        { clipPath: "inset(7% 6% 14% 6% round 20px)", ease: "none" },
        0.12
      );
      if (overlay) {
        scrollTl.fromTo(overlay, { opacity: 0.45 }, { opacity: 0.1, ease: "none" }, 0.25);
      }
      scrollTl.to(curtain, { yPercent: -92, ease: "none" }, 0.48);

      return () => scrollTl.kill();
    };

    mm.add("(min-width: 900px)", desktopAnimation);
    mm.add("(max-width: 899px)", mobileAnimation);
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      mm.revert();
    };
  }, []);

  return (
    <section
      id="popsicle-hero"
      ref={sectionRef}
      className="popsicle-hero relative bg-[#A31D1D]"
    >
      <div
        ref={innerRef}
        className="popsicle-hero__stage relative w-full overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          {children}
        </div>

        <div
          ref={curtainRef}
          className="absolute inset-0 z-10 overflow-hidden rounded-b-[30px] bg-[#F5E6D3] md:rounded-b-[36px]"
        >
          <Marquee variant="background" />

          <div
            ref={imageWrapRef}
            className="absolute inset-0 z-10 will-change-[clip-path]"
            style={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
          >
            <img
              ref={imgRef}
              src="/images/popsicle-hero.webp"
              alt="Woman enjoying chocolate ice cream"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{ transform: "scale(1)" }}
              loading="lazy"
            />
            <div
              ref={overlayRef}
              className="absolute inset-0 bg-gradient-to-t from-[#2A1810]/45 via-[#2A1810]/12 to-transparent"
              style={{ opacity: 0.45 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
