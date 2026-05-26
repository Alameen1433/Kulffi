"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Phone, Globe, Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants/navigation";
import DemoNoticeModal from "@/components/shared/DemoNoticeModal";

interface ContactProps {
  layered?: boolean;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function Contact({ layered = false }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [showDemoNotice, setShowDemoNotice] = useState(false);

  useEffect(() => {
    if (layered) return;

    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    if (headlineRef.current) {
      const tl = gsap.fromTo(
        headlineRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
      tweens.push(tl);
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    if (formRef.current) {
      const fields = formRef.current.querySelectorAll(".form-field");
      const tl = gsap.fromTo(
        fields,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 85%",
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
  }, [layered]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setStatus("idle");
    setErrorMsg("");
    setShowDemoNotice(true);
  };

  // Fields animate in via GSAP; no inline opacity needed

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`${
        layered ? "absolute inset-0 z-0 min-h-screen-safe" : "relative"
      } bg-[#A31D1D]`}
    >
      <div
        className={`px-5 md:px-12 max-w-[1400px] mx-auto flex flex-col ${
          layered
            ? "min-h-full h-full pt-[4.5rem] md:pt-24 lg:pt-28 pb-6 md:pb-10 justify-start md:justify-center overflow-y-auto overflow-x-hidden pb-safe"
            : "py-24 md:py-32"
        }`}
      >
        {/* ── Header ── */}
        <div className={`${layered ? "mb-7 md:mb-10" : "mb-16 md:mb-20"}`}>
          <h2
            ref={headlineRef}
            className="font-blenny text-[clamp(2.5rem,14vw,5rem)] leading-[1] tracking-tight text-[#FCE9D5]"
          >
            Say Hello
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-[#FCE9D5]/55 max-w-[420px] leading-relaxed">
            Have a question about our flavors, partnerships, or just want to say hi? Drop us a line.
          </p>
        </div>

        {/* ── Content Grid ── */}
        <div className={`grid lg:grid-cols-[1fr_1.2fr] ${layered ? "gap-8 md:gap-14 lg:gap-16" : "gap-16 md:gap-20 lg:gap-24"}`}>
          {/* Left: Contact Info */}
          <div className={`flex flex-col ${layered ? "gap-5 md:gap-8" : "gap-10 md:gap-12"}`}>
            <div className="form-field">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full border border-[#FCE9D5]/20 shrink-0">
                  <Mail className="h-4 w-4 text-[#FCE9D5]/70" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FCE9D5]/40 mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:hello@kulffi.com"
                  className="break-all text-base md:text-lg text-[#FCE9D5] hover:text-[#FCE9D5]/80 transition-colors duration-300"
                  >
                    hello@kulffi.com
                  </a>
                </div>
              </div>
            </div>

            <div className="form-field">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full border border-[#FCE9D5]/20 shrink-0">
                  <Phone className="h-4 w-4 text-[#FCE9D5]/70" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FCE9D5]/40 mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:+919876543210"
                    className="text-base md:text-lg text-[#FCE9D5] hover:text-[#FCE9D5]/80 transition-colors duration-300"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </div>

            <div className="form-field">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full border border-[#FCE9D5]/20 shrink-0">
                  <MapPin className="h-4 w-4 text-[#FCE9D5]/70" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FCE9D5]/40 mb-1">
                    Kitchen
                  </p>
                  <p className="text-base md:text-lg text-[#FCE9D5] leading-relaxed">
                    12 Bandra West, Mumbai
                    <br />
                    Maharashtra, India 400050
                  </p>
                </div>
              </div>
            </div>

            <div className="form-field">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full border border-[#FCE9D5]/20 shrink-0">
                  <Globe className="h-4 w-4 text-[#FCE9D5]/70" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FCE9D5]/40 mb-1">
                    Follow
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {SOCIAL_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#FCE9D5]/70 hover:text-[#FCE9D5] transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <form ref={formRef} onSubmit={handleSubmit} className={`flex flex-col ${layered ? "gap-5 md:gap-6" : "gap-8 md:gap-10"}`}>
            <div className="form-field">
              <label htmlFor="contact-name" className={`block text-[11px] font-bold uppercase tracking-[0.2em] text-[#FCE9D5]/40 ${layered ? "mb-1.5" : "mb-3"}`}>
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                disabled={status === "loading"}
                  className={`w-full bg-transparent border-b-2 border-[#FCE9D5]/25 text-[#FCE9D5] text-base md:text-xl placeholder-[#FCE9D5]/30 outline-none focus:border-[#FCE9D5] transition-colors duration-300 disabled:opacity-40 ${layered ? "py-3" : "py-4"}`}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-email" className={`block text-[11px] font-bold uppercase tracking-[0.2em] text-[#FCE9D5]/40 ${layered ? "mb-1.5" : "mb-3"}`}>
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                disabled={status === "loading"}
                className={`w-full bg-transparent border-b-2 border-[#FCE9D5]/25 text-[#FCE9D5] text-base md:text-xl placeholder-[#FCE9D5]/30 outline-none focus:border-[#FCE9D5] transition-colors duration-300 disabled:opacity-40 ${layered ? "py-3" : "py-4"}`}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-message" className={`block text-[11px] font-bold uppercase tracking-[0.2em] text-[#FCE9D5]/40 ${layered ? "mb-1.5" : "mb-3"}`}>
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={layered ? 2 : 3}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
                disabled={status === "loading"}
                className={`w-full bg-transparent border-b-2 border-[#FCE9D5]/25 text-[#FCE9D5] text-base md:text-xl placeholder-[#FCE9D5]/30 outline-none focus:border-[#FCE9D5] transition-colors duration-300 resize-none disabled:opacity-40 ${layered ? "py-3" : "py-4"}`}
              />
            </div>

            {/* Feedback message */}
            <div aria-live="polite" aria-atomic="true">
              {status === "success" && (
                <div className="form-field flex items-center gap-2 text-sm text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Message sent! We&apos;ll get back to you soon.</span>
                </div>
              )}
              {status === "error" && (
                <div className="form-field flex items-center gap-2 text-sm text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <div className={`form-field ${layered ? "pt-2" : "pt-4"}`}>
              <button
                type="submit"
                disabled={status === "loading"}
                className="group relative inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full border-[3px] border-[#2A1810] bg-[#FCE9D5] px-7 py-3.5 text-[#A31D1D] shadow-[5px_5px_0_#2A1810] transition-all duration-300 hover:-translate-y-1 hover:bg-[#FFD166] hover:shadow-[7px_7px_0_#2A1810] active:translate-y-[2px] active:shadow-[2px_2px_0_#2A1810] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#FCE9D5] disabled:hover:shadow-[5px_5px_0_#2A1810] sm:w-auto sm:min-w-[13rem] md:min-h-16 md:min-w-[15rem] md:px-9"
              >
                {status === "loading" ? (
                  <Loader2 className="h-5 w-5 text-[#A31D1D] animate-spin" strokeWidth={2.5} />
                ) : status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" strokeWidth={2.5} />
                ) : (
                  <>
                    <span className="font-display text-[13px] font-black uppercase tracking-[0.18em] md:text-sm">
                      Send Message
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A31D1D] text-[#FCE9D5] transition-transform duration-300 group-hover:translate-x-1">
                      <Send className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <DemoNoticeModal
        open={showDemoNotice}
        onClose={() => setShowDemoNotice(false)}
        actionLabel="Contact form submission"
      />
    </section>
  );
}
