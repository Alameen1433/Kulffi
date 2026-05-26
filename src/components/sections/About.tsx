"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    // Headline reveal
    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll(".split-word");
      const tl = gsap.fromTo(
        words,
        { y: "120%", rotate: 10, opacity: 0 },
        {
          y: 0,
          rotate: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: "back.out(1.7)",
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

    // Image pop-in — NO conflicting CSS transitions
    if (imageRef.current) {
      const tl = gsap.fromTo(
        imageRef.current,
        { scale: 0.8, rotate: -15, opacity: 0 },
        {
          scale: 1,
          rotate: -4,
          opacity: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
      tweens.push(tl);
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    // Text box slide-up
    if (textRef.current) {
      const tl = gsap.fromTo(
        textRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      tweens.push(tl);
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    // Floating decorations — use fromTo for smooth start
    const floatingTweens: gsap.core.Tween[] = [];
    if (decorRef.current) {
      const items = decorRef.current.querySelectorAll(".float-item");
      items.forEach((item, i) => {
        const speed = 4 + (i % 3) * 1.5;
        const yAmp = 20 + (i % 2) * 15;
        const rotAmp = 10 + (i % 3) * 8;
        const tween = gsap.fromTo(
          item,
          { y: 0, rotate: 0 },
          {
            y: yAmp,
            rotate: rotAmp,
            duration: speed,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.6,
          }
        );
        tweens.push(tween);
        floatingTweens.push(tween);
      });
    }

    // Pause/resume floating tweens when section is off-screen
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          floatingTweens.forEach((t) => t.resume());
        } else {
          floatingTweens.forEach((t) => t.pause());
        }
      },
      { threshold: 0 }
    );
    if (sectionRef.current) visibilityObserver.observe(sectionRef.current);

    return () => {
      tweens.forEach((t) => t.kill());
      triggers.forEach((st) => st.kill());
      visibilityObserver.disconnect();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden py-[4.5rem] md:py-40"
      style={{
        backgroundColor: "#FFD166",
        backgroundImage: `radial-gradient(circle, rgba(163,29,29,0.14) 1.5px, transparent 1.5px)`,
        backgroundSize: "18px 18px",
      }}
    >
      {/* Warm radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 60%, rgba(252,233,213,0.5) 0%, transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(163,29,29,0.08) 0%, transparent 50%)",
        }}
      />

      {/* Large background text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span
          className="font-display whitespace-nowrap text-[20vw] font-bold uppercase leading-none tracking-tighter text-[#A31D1D] opacity-[0.06]"
          style={{ transform: "rotate(-8deg)" }}
        >
          KULFFI &bull; KULFFI &bull; KULFFI &bull;
        </span>
      </div>

      {/* Decorative shapes layer */}
      <div ref={decorRef} className="pointer-events-none absolute inset-0 z-0">
        {/* Star 1 */}
        <div className="float-item absolute top-[5%] left-[8%] text-[#A31D1D] opacity-30 md:opacity-40">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
            <path d="M24 0L29 19L48 24L29 29L24 48L19 29L0 24L19 19Z" />
          </svg>
        </div>

        {/* Star 2 */}
        <div className="float-item absolute bottom-[12%] right-[6%] text-[#A31D1D] opacity-25 md:opacity-35">
          <svg width="64" height="64" viewBox="0 0 48 48" fill="currentColor">
            <path d="M24 0L29 19L48 24L29 29L24 48L19 29L0 24L19 19Z" />
          </svg>
        </div>

        {/* Circle 1 */}
        <div className="float-item absolute top-[15%] right-[20%] h-10 w-10 rounded-full border-2 border-[#A31D1D] opacity-30 md:h-14 md:w-14 md:opacity-40" />

        {/* Circle 2 */}
        <div className="float-item absolute bottom-[25%] left-[5%] h-16 w-16 rounded-full bg-[#A31D1D] opacity-15 md:h-20 md:w-20" />

        {/* Zigzag 1 */}
        <div className="float-item absolute top-[40%] right-[3%] text-[#A31D1D] opacity-25 md:opacity-35">
          <svg width="60" height="32" viewBox="0 0 60 32" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square">
            <polyline points="4,16 16,4 28,28 44,4 56,16" />
          </svg>
        </div>

        {/* Zigzag 2 */}
        <div className="float-item absolute bottom-[8%] left-[25%] text-[#A31D1D] opacity-20 md:opacity-30">
          <svg width="48" height="24" viewBox="0 0 60 32" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square">
            <polyline points="4,16 16,4 28,28 44,4 56,16" />
          </svg>
        </div>

        {/* Plus 1 */}
        <div className="float-item absolute top-[8%] right-[45%] text-[#A31D1D] opacity-30">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor">
            <rect x="12" y="0" width="4" height="28" />
            <rect x="0" y="12" width="28" height="4" />
          </svg>
        </div>

        {/* Plus 2 */}
        <div className="float-item absolute bottom-[35%] right-[12%] text-[#A31D1D] opacity-25">
          <svg width="20" height="20" viewBox="0 0 28 28" fill="currentColor">
            <rect x="12" y="0" width="4" height="28" />
            <rect x="0" y="12" width="28" height="4" />
          </svg>
        </div>

        {/* Dot cluster */}
        <div className="float-item absolute top-[55%] left-[2%] flex flex-col gap-2 opacity-30 md:opacity-40">
          <span className="h-2.5 w-2.5 rounded-full bg-[#A31D1D]" />
          <span className="ml-4 h-2 w-2 rounded-full bg-[#A31D1D]" />
          <span className="h-3 w-3 rounded-full bg-[#A31D1D]" />
        </div>

        {/* Scribble line */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <path
            d="M40 60 Q80 40 120 70 T200 55"
            stroke="#A31D1D"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.2"
          />
          <path
            d="M-20 0 Q20 30 0 80 T40 160"
            stroke="#A31D1D"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.15"
            transform="translate(0, 100)"
          />
          <path
            d="M0 0 Q-30 40 -10 100"
            stroke="#A31D1D"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.2"
            transform="translate(360 320)"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-blenny mb-12 flex flex-col items-center text-center text-[clamp(3rem,18vw,8rem)] leading-[0.84] tracking-tighter text-[#A31D1D] drop-shadow-[3px_3px_0_#FCE9D5] md:mb-24 md:drop-shadow-[4px_4px_0_#FCE9D5]"
        >
          <span className="block overflow-hidden py-2">
            <span className="split-word inline-block origin-bottom">THIS IS</span>
          </span>
          <span className="block overflow-hidden py-2">
            <span className="split-word inline-block origin-bottom text-[#FCE9D5] drop-shadow-[4px_4px_0_#A31D1D]">
              KULFFI.
            </span>
          </span>
        </h2>

        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-12">
          {/* Image (Pop-art Polaroid Style) */}
          <div className="relative flex justify-center md:col-span-5 lg:col-span-6">
            {/* Wrapper for hover effect — NOT animated by GSAP */}
            <div className="group transition-transform duration-500 hover:scale-105">
              <div
                ref={imageRef}
                className="relative aspect-[4/5] w-[calc(100vw-4rem)] max-w-[340px] border-[3px] border-[#A31D1D] bg-[#FCE9D5] p-3 pb-12 shadow-[7px_7px_0_#A31D1D] group-hover:rotate-0 md:w-full md:max-w-[400px] md:border-4 md:p-4 md:pb-16 md:shadow-[12px_12px_0_#A31D1D]"
                style={{ transform: "rotate(-4deg)" }}
              >
                <img
                  src="/images/about.webp"
                  alt="Close up of chocolate ice cream against terracotta wall"
                  className="h-full w-full border-2 border-[#A31D1D] object-cover"
                  loading="lazy"
                />
                {/* Fake polaroid tape */}
                <div className="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 rotate-2 border-2 border-[#A31D1D] bg-[#FCE9D5]/80 shadow-sm backdrop-blur-sm" />

                {/* 100% Natural Stamp */}
                <div
                  className="absolute -bottom-4 -right-4 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-2 border-[#A31D1D] bg-[#FFD166] text-[#A31D1D] shadow-md md:-right-6 md:h-24 md:w-24"
                  style={{ transform: "rotate(-12deg)" }}
                >
                  <div className="text-center">
                    <span className="block font-display text-[10px] font-bold uppercase leading-none tracking-widest md:text-xs">
                      100%
                    </span>
                    <span className="block font-display text-[10px] font-bold uppercase leading-none tracking-widest md:text-xs">
                      Natural
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Box */}
          <div className="flex flex-col justify-center md:col-span-7 lg:col-span-6">
            <div
              ref={textRef}
              className="relative flex flex-col gap-5 rounded-lg border-[3px] border-[#A31D1D] bg-[#FCE9D5] p-6 shadow-[6px_6px_0_#A31D1D] md:gap-6 md:rounded-xl md:border-4 md:p-12 md:shadow-[8px_8px_0_#A31D1D]"
            >
              {/* Comic decorative dots */}
              <div className="absolute right-4 top-4 flex gap-1">
                <span className="h-3 w-3 rounded-full bg-[#A31D1D]" />
                <span className="h-3 w-3 rounded-full bg-[#A31D1D]" />
              </div>

              <p className="font-display text-lg font-bold uppercase leading-tight tracking-wide text-[#A31D1D] md:text-2xl">
                It hits different, even if you think you don&apos;t like ice
                cream.
              </p>

              <div className="my-2 h-1 w-full bg-[#A31D1D]" />

              <p className="text-[15px] font-medium leading-relaxed text-[#A31D1D]/90 md:text-lg">
                Our goal isn&apos;t just ice cream. That would be too easy. We
                need to make you feel something when you bite into our bar.
                Something that stays.
              </p>
              <p className="text-[15px] font-medium leading-relaxed text-[#A31D1D]/90 md:text-lg">
                We don&apos;t tolerate shortcuts: not in flavors, not in
                ingredients, not in production. Prepare for a dopamine craving
                for &quot;that exact taste.&quot;
              </p>

              <div className="self-start pt-6">
                <button
                  onClick={() => document.getElementById("story-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="group min-h-12 rounded-full border-2 border-[#A31D1D] bg-[#A31D1D] px-7 py-3 font-display text-[12px] font-bold uppercase tracking-widest text-[#FCE9D5] shadow-[3px_3px_0_#2A1810] transition-all duration-300 hover:-translate-y-1 hover:bg-[#FCE9D5] hover:text-[#A31D1D] hover:shadow-[6px_6px_0_#A31D1D] active:translate-y-[2px] active:shadow-[2px_2px_0_#A31D1D] md:px-8 md:text-[14px] md:shadow-[4px_4px_0_#2A1810]"
                >
                  Read Our Story
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
