"use client";

import { ExternalLink, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect } from "react";

interface DemoNoticeModalProps {
  open: boolean;
  onClose: () => void;
  actionLabel?: string;
}

export default function DemoNoticeModal({
  open,
  onClose,
  actionLabel = "This action",
}: DemoNoticeModalProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-[#2A1810]/70 px-5 py-8 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-notice-title"
    >
      <button
        type="button"
        aria-label="Close demo notice"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[430px] overflow-hidden rounded-[1.4rem] border-[3px] border-[#A31D1D] bg-[#FCE9D5] p-6 text-[#A31D1D] shadow-[8px_8px_0_#2A1810] md:p-8">
        <button
          type="button"
          aria-label="Close demo notice"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#A31D1D] bg-[#FCE9D5] text-[#A31D1D] transition-all duration-300 hover:bg-[#A31D1D] hover:text-[#FCE9D5]"
        >
          <X className="h-4 w-4" strokeWidth={3} />
        </button>

        <p className="mb-3 pr-12 font-display text-[11px] font-bold uppercase tracking-[0.24em] text-[#A31D1D]/55">
          Demo Showcase
        </p>
        <h2
          id="demo-notice-title"
          className="font-blenny text-[clamp(2.5rem,13vw,4.25rem)] leading-[0.9] text-[#A31D1D]"
        >
          Built for Xenora
        </h2>
        <p className="mt-5 text-[15px] font-semibold leading-relaxed text-[#A31D1D]/80">
          {actionLabel} is disabled because this is a demo instance running for Xenora Solutions. This page is a showcase experience, not a live store.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://xenorasolutions.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#A31D1D] bg-[#A31D1D] px-5 py-3 font-display text-[12px] font-bold uppercase tracking-[0.16em] text-[#FCE9D5] shadow-[3px_3px_0_#2A1810] transition-all duration-300 hover:-translate-y-1 hover:shadow-[5px_5px_0_#2A1810]"
          >
            Visit Xenora
            <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 border-[#A31D1D] px-5 py-3 font-display text-[12px] font-bold uppercase tracking-[0.16em] text-[#A31D1D] transition-all duration-300 hover:bg-[#A31D1D] hover:text-[#FCE9D5]"
          >
            Stay Here
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
