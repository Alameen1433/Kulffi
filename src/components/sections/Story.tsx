"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

const STORY_LINES = [
  "We make kulffi the way it has always been made",
  "With ingredients that travel further than we do",
  "And patience that cannot be rushed",
];

const DIM_OPACITY = 0.55;

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function getWordOpacity(
  scrollProgress: number,
  lineIndex: number,
  wordIndex: number,
  totalWordsInLine: number
): number {
  const p = clamp(scrollProgress, 0, 1);
  const lineWindow = 1 / STORY_LINES.length;
  const lineStart = lineIndex * lineWindow;
  const lineEnd = lineStart + lineWindow + 0.02;

  if (p < lineStart) return DIM_OPACITY;
  if (p > lineEnd) return 1;

  const lineProgress = (p - lineStart) / (lineEnd - lineStart);
  const DEAD_ZONE = 0.05;
  const wordTrigger = (wordIndex / totalWordsInLine) * (1 - DEAD_ZONE) + DEAD_ZONE;
  const fadeWindow = 0.025;

  if (lineProgress < wordTrigger - fadeWindow) return DIM_OPACITY;
  if (lineProgress < wordTrigger + fadeWindow) {
    const t = (lineProgress - (wordTrigger - fadeWindow)) / (fadeWindow * 2);
    return DIM_OPACITY + easeOutCubic(clamp(t, 0, 1)) * (1 - DIM_OPACITY);
  }
  return 1;
}

export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollRef = useRef(0);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;

    // IntersectionObserver to pause rAF loop when section is off-screen
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(section);

    // Parallax background image — gentle drift, full image visible
    const parallaxTween = gsap.fromTo(
      img,
      { y: "-12%" },
      {
        y: "12%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    let rafId: number;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollRange = Math.max(1, rect.height - vh);
      scrollRef.current = clamp(-rect.top / scrollRange, 0, 1);
    };

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      if (!isVisibleRef.current) return;

      const sp = scrollRef.current;

      STORY_LINES.forEach((_, lineIndex) => {
        const lineEl = lineRefs.current[lineIndex];
        if (!lineEl) return;

        const words = lineEl.querySelectorAll<HTMLSpanElement>("[data-word]");
        const totalWords = words.length;

        words.forEach((wordEl, wordIndex) => {
          const opacity = getWordOpacity(sp, lineIndex, wordIndex, totalWords);
          const rounded = (opacity * 100 + 0.5 | 0) / 100; // round to 2 decimals
          const prev = wordEl.dataset.op;
          const next = String(rounded);
          if (prev !== next) {
            wordEl.style.opacity = next;
            wordEl.dataset.op = next;
            if (rounded > 0.9) {
              wordEl.classList.add("story-word--active");
            } else {
              wordEl.classList.remove("story-word--active");
            }
          }
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
      visibilityObserver.disconnect();
      parallaxTween.kill();
      if (parallaxTween.scrollTrigger) parallaxTween.scrollTrigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story-section"
      className="relative min-h-[160svh] md:min-h-[170svh]"
    >
      {/* Parallax background — full bleed */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imgRef}
          src="/images/friends-popsicle.webp"
          alt="Friends enjoying Kulffi"
          className="absolute left-0 w-full object-cover"
          style={{ height: "124%", top: "-12%" }}
          loading="lazy"
        />
        {/* Mild dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(42,24,16,0.35) 0%, rgba(42,24,16,0.55) 40%, rgba(42,24,16,0.55) 60%, rgba(42,24,16,0.35) 100%)",
          }}
        />
      </div>

      {/* Story text — centered, sticky feel via scroll range */}
      <div className="sticky top-0 z-10 flex min-h-screen-safe items-center justify-center px-5 md:px-6">
        <div className="flex flex-col items-center gap-8 py-28 md:gap-14 md:py-56">
          {STORY_LINES.map((line, lineIndex) => {
            const words = line.split(" ");
            return (
              <div
                key={lineIndex}
                ref={(el) => { lineRefs.current[lineIndex] = el; }}
                className="text-center leading-[1.3] tracking-[0.01em] flex flex-wrap justify-center gap-x-4 md:gap-x-5 gap-y-1.5"
                style={{
                  fontFamily: "var(--font-serif), serif",
                  fontSize: "clamp(1.9rem, 9vw, 52px)",
                  textWrap: "balance",
                  textShadow: "0 2px 20px rgba(0,0,0,0.35)",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                }}
              >
                {words.map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    data-word
                    className="inline-block story-word"
                    style={{
                      opacity: DIM_OPACITY,
                      willChange: "opacity",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
