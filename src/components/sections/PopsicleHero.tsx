"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "@/components/sections/Marquee";

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

    const triggers: ScrollTrigger[] = [];
    const mm = gsap.matchMedia();

    mm.add("(min-width: 900px)", () => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          pin: inner,
          pinSpacing: false,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      if (scrollTl.scrollTrigger) triggers.push(scrollTl.scrollTrigger);

      scrollTl.fromTo(
        img,
        { scale: 1 },
        { scale: 1.25, ease: "none" },
        0
      );

      scrollTl.fromTo(
        imageWrap,
        { clipPath: "inset(0% 0% 0% 0% round 0px)" },
        { clipPath: "inset(12% 27.5% 12% 27.5% round 24px)", ease: "none" },
        0.15
      );

      if (overlay) {
        scrollTl.fromTo(
          overlay,
          { opacity: 0.45 },
          { opacity: 0, ease: "none" },
          0.3
        );
      }

      scrollTl.to(
        curtain,
        {
          yPercent: -90,
          ease: "none",
        },
        0.5
      );

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
          end: "+=100%",
          pin: inner,
          pinSpacing: false,
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      if (mobileTl.scrollTrigger) triggers.push(mobileTl.scrollTrigger);

      mobileTl.fromTo(
        img,
        { scale: 1 },
        { scale: 1.1, ease: "none" },
        0
      );

      mobileTl.fromTo(
        imageWrap,
        { clipPath: "inset(0% 0% 0% 0% round 0px)" },
        { clipPath: "inset(10% 8% 18% 8% round 22px)", ease: "none" },
        0.14
      );

      if (overlay) {
        mobileTl.fromTo(
          overlay,
          { opacity: 0.45 },
          { opacity: 0.08, ease: "none" },
          0.3
        );
      }

      mobileTl.to(
        curtain,
        {
          yPercent: -90,
          ease: "none",
        },
        0.52
      );

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
      id="popsicle-hero"
      ref={sectionRef}
      className="relative bg-[#A31D1D] h-[205svh] md:h-[220vh]"
    >
      <div
        ref={innerRef}
        className="relative h-screen-safe w-full overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          {children}
        </div>

        <div
          ref={curtainRef}
          className="absolute inset-0 z-10 overflow-hidden rounded-b-[36px] bg-[#F5E6D3]"
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
