"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/faq";
import { cn } from "@/lib/cn";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Questions teams ask before they start"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.question}
                  className={cn(
                    "rounded-2xl transition-shadow",
                    isOpen ? "glass-strong" : "neo"
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left text-base font-semibold text-ink"
                    >
                      {item.question}
                      <svg
                        aria-hidden
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className={cn(
                          "shrink-0 text-primary-600 transition-transform duration-200",
                          isOpen && "rotate-45"
                        )}
                      >
                        <path d="M10 4v12M4 10h12" />
                      </svg>
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    hidden={!isOpen}
                    className="px-6 pb-6"
                  >
                    <p className="leading-relaxed text-ink-body">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
