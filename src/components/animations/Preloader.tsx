"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete?: () => void;
}

// ── Critical assets only ──
const CRITICAL_IMAGES = ["/images/hero.webp"];

const FLAVOR_NAMES = [
  "Saffron", "Mango", "Pistachio", "Dark Chocolate",
  "Malai Almond", "Filter Kaapi", "Coco-Choc", "Honey Fig",
];

const TOTAL_TASKS = CRITICAL_IMAGES.length + 1; // +1 for fonts
const MARQUEE_TEXT = Array(20).fill("KULFFI TRUE ICE CREAM").join("\u00A0\u00A0\u00A0\u00A0");

function playPopSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Silent fallback
  }
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function loadBackgroundImages() {
  const bgImages = [
    "/images/about.webp",
    "/images/friends-popsicle.webp",
    "/images/ice_cream_bar.webp",
    "/images/mango_bar.webp",
    "/images/dark_choc_bar.webp",
    "/images/saffron.webp",
    "/images/malai.webp",
    "/images/coffee.webp",
    "/images/coconut.webp",
    "/images/fig.webp",
  ];

  const schedule = () => {
    bgImages.forEach((src, i) => {
      setTimeout(() => { const img = new Image(); img.src = src; }, i * 150);
    });
  };

  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(schedule, { timeout: 3000 });
  } else {
    setTimeout(schedule, 2000);
  }
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const mqTlRef = useRef<gsap.core.Timeline | null>(null);
  
  const tasksDoneRef = useRef(0);
  const displayPctRef = useRef(0);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);
  const isCompleteRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const triggerExit = useCallback(() => {
    playPopSound();
    const container = containerRef.current;
    if (!container) {
      onCompleteRef.current?.();
      return;
    }

    const forceFinish = window.setTimeout(() => {
      container.style.display = "none";
      onCompleteRef.current?.();
    }, 1800);
    
    // Freeze the infinite marquees immediately
    if (mqTlRef.current) mqTlRef.current.pause();

    const exitTl = gsap.timeline({
      onComplete: () => {
        window.clearTimeout(forceFinish);
        container.style.display = "none";
        onCompleteRef.current?.();
      },
    });
    
    // 1. Blast the UI percentage forward and fade out
    exitTl.to([percentTextRef.current, statusRef.current], {
      scale: 3,
      autoAlpha: 0,
      duration: 0.5,
      ease: "power3.in"
    }, 0);

    // 2. Collapse the top and bottom rows into the center and fade them out to prevent messy text overlap
    exitTl.to(row1Ref.current, { yPercent: 100, opacity: 0, duration: 0.5, ease: "power3.in" }, 0.2);
    exitTl.to(row3Ref.current, { yPercent: -100, opacity: 0, duration: 0.5, ease: "power3.in" }, 0.2);

    // 3. Only the center row remains; flash it to full opacity
    exitTl.to(row2Ref.current, {
      opacity: 1,
      duration: 0.1
    }, 0.6);

    exitTl.to(container, {
      scale: 3,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
      transformOrigin: "center center"
    }, 0.6);

  }, []);

  // Entrance and Infinite Marquee Animation
  useEffect(() => {
    // Entrance fade removed to make preloader visible instantly
    gsap.fromTo([percentTextRef.current, statusRef.current],
      { scale: 0.8, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.1 }
    );

    // 2. Infinite Kinetic Marquee setup
    const mqTl = gsap.timeline({ repeat: -1 });
    
    // row1 and row3 move left
    gsap.set([row1Ref.current, row3Ref.current], { xPercent: 0 });
    // row2 moves right (so we start it offset and move to 0)
    gsap.set(row2Ref.current, { xPercent: -30 });

    mqTl.to([row1Ref.current, row3Ref.current], { xPercent: -30, duration: 15, ease: "none" }, 0);
    mqTl.to(row2Ref.current, { xPercent: 0, duration: 15, ease: "none" }, 0);
    
    mqTlRef.current = mqTl;

    return () => { 
      mqTl.kill(); 
    };
  }, []);

  // Resource loading
  useEffect(() => {
    startTimeRef.current = performance.now();

    function updateProgress() {
      tasksDoneRef.current++;
      const rawPct = Math.min((tasksDoneRef.current / TOTAL_TASKS) * 100, 100);
      const targetVal = Math.round(rawPct);
      const startVal = displayPctRef.current;
      const startTime = performance.now();
      const duration = 500; 

      function tick() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        displayPctRef.current = Math.round(startVal + (targetVal - startVal) * eased);
        const pct = displayPctRef.current;

        const percent = percentTextRef.current;
        const status = statusRef.current;

        if (percent) {
          percent.textContent = `${pct}`;
        }

        if (status) {
          const fi = Math.floor((pct / 100) * FLAVOR_NAMES.length);
          const currentFlavor = FLAVOR_NAMES[Math.min(fi, FLAVOR_NAMES.length - 1)].toUpperCase();
          status.textContent = `LOADING ${currentFlavor}...`;
        }

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else if (rawPct >= 100) {
          checkComplete();
        }
      }

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }

    function checkComplete() {
      if (isCompleteRef.current) return;
      const elapsed = performance.now() - startTimeRef.current;
      const minTime = 1500; // Let the marquees spin a bit
      const remaining = Math.max(0, minTime - elapsed);

      setTimeout(() => {
        if (isCompleteRef.current) return;
        isCompleteRef.current = true;
        
        displayPctRef.current = 100;
        if (percentTextRef.current) percentTextRef.current.textContent = `100`;
        
        triggerExit();
        loadBackgroundImages();
      }, remaining);
    }

    CRITICAL_IMAGES.forEach((src) => preloadImage(src).then(updateProgress));

    Promise.all([
      document.fonts.ready,
      document.fonts.load("900 16px Blenny"),
      document.fonts.load("400 16px Space Grotesk"),
      document.fonts.load("400 16px Inter"),
    ]).then(() => {
      updateProgress();
    });

    const safetyTimer = setTimeout(() => {
      if (!isCompleteRef.current) {
        isCompleteRef.current = true;
        displayPctRef.current = 100;
        if (percentTextRef.current) percentTextRef.current.textContent = `100`;
        const container = containerRef.current;
        if (container) container.style.display = "none";
        onCompleteRef.current?.();
        loadBackgroundImages();
      }
    }, 2500);

    return () => {
      clearTimeout(safetyTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [triggerExit]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none bg-[#A31D1D] overflow-hidden flex flex-col justify-center">
      
      {/* 
        Kinetic Marquee Container
        Tilted slightly, scaled up to ensure edges don't show during rotation 
      */}
      <div className="absolute inset-0 flex flex-col justify-center gap-0 md:gap-2 -rotate-6 scale-[1.2]">
        <div 
          ref={row1Ref} 
          className="whitespace-nowrap font-blenny text-[#F5E6D3] opacity-15 text-[clamp(6rem,18vw,12rem)] leading-[0.8] tracking-tighter will-change-transform"
        >
          {MARQUEE_TEXT}
        </div>
        <div 
          ref={row2Ref} 
          className="whitespace-nowrap font-blenny text-[#F5E6D3] opacity-15 text-[clamp(6rem,18vw,12rem)] leading-[0.8] tracking-tighter will-change-transform"
        >
          {MARQUEE_TEXT}
        </div>
        <div 
          ref={row3Ref} 
          className="whitespace-nowrap font-blenny text-[#F5E6D3] opacity-15 text-[clamp(6rem,18vw,12rem)] leading-[0.8] tracking-tighter will-change-transform"
        >
          {MARQUEE_TEXT}
        </div>
      </div>

      {/* Central UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#F5E6D3] z-10">
        <div 
          ref={percentTextRef} 
          className="font-display font-black text-[clamp(8rem,25vw,18rem)] tracking-tighter leading-none tabular-nums drop-shadow-2xl will-change-transform"
          style={{ opacity: 0 }}
        >
          0
        </div>
        <div 
          ref={statusRef} 
          className="font-bold text-[10px] md:text-[14px] tracking-[0.5em] uppercase mt-2 will-change-transform drop-shadow-md"
          style={{ opacity: 0 }}
        >
          INITIALIZING...
        </div>
      </div>

    </div>
  );
}
