"use client";

import { useEffect, useState } from "react";

/**
 * Bengali alpana preloader. A rice-paste floor-art mandala — layered lotus
 * petals, kolka (paisley) sprigs, scalloped and dotted rings — draws itself
 * in stroke by stroke on a cream overlay while the page loads, then blooms
 * and fades away. Colors follow the brand terracotta/amber palette with a
 * white "rice paste" highlight pass, echoing chalk lines on an earthen floor.
 *
 * Hides once the window `load` event fires, but never before MIN_SHOW_MS so
 * the draw-in reads as a deliberate flourish rather than a flash.
 */

const MIN_SHOW_MS = 2200;
const FADE_MS = 700;

/** Eight-fold symmetric copies of a motif group. */
function Radial({
  children,
  count = 8,
  offset = 0,
}: {
  children: React.ReactNode;
  count?: number;
  offset?: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`rotate(${offset + (360 / count) * i} 200 200)`}>
          {children}
        </g>
      ))}
    </>
  );
}

export function AlpanaPreloader() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const shownAt = performance.now();
    let fadeTimer: ReturnType<typeof setTimeout>;
    let holdTimer: ReturnType<typeof setTimeout>;

    const dismiss = () => {
      const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - shownAt));
      holdTimer = setTimeout(() => {
        setLeaving(true);
        fadeTimer = setTimeout(() => setGone(true), FADE_MS);
      }, wait);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }
    return () => {
      window.removeEventListener("load", dismiss);
      clearTimeout(holdTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream-50 transition-opacity ease-out ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="alpana-spin relative">
        {/* Soft halo behind the mandala */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-100/70 via-accent-100/50 to-transparent blur-2xl" />

        <svg
          viewBox="0 0 400 400"
          className="relative h-56 w-56 sm:h-72 sm:w-72"
          fill="none"
        >
          {/* ── Outermost dotted ring (bindu border) ── */}
          <circle
            cx="200"
            cy="200"
            r="188"
            stroke="#C13E12"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0.1 14.6"
            pathLength="944"
            className="alpana-draw"
            style={{ animationDelay: "1.5s" }}
          />

          {/* ── Scalloped mehrab ring ── */}
          <path
            d={Array.from({ length: 24 }, (_, i) => {
              const a1 = (i / 24) * 2 * Math.PI - Math.PI / 2;
              const a2 = ((i + 1) / 24) * 2 * Math.PI - Math.PI / 2;
              const am = (a1 + a2) / 2;
              const r = 172;
              const rb = 158;
              const x1 = 200 + r * Math.cos(a1);
              const y1 = 200 + r * Math.sin(a1);
              const xm = 200 + rb * Math.cos(am);
              const ym = 200 + rb * Math.sin(am);
              const x2 = 200 + r * Math.cos(a2);
              const y2 = 200 + r * Math.sin(a2);
              return `${i === 0 ? `M ${x1} ${y1}` : ""} Q ${xm} ${ym} ${x2} ${y2}`;
            }).join(" ")}
            stroke="#EA5420"
            strokeOpacity="0.55"
            strokeWidth="1.6"
            pathLength="1"
            className="alpana-trace"
            style={{ animationDelay: "1.2s" }}
          />

          {/* ── Outer lotus crown: 8 large petals ── */}
          <Radial>
            <g className="alpana-bloom" style={{ animationDelay: "0.15s" }}>
              <path
                d="M200 52 C232 84 238 122 200 152 C162 122 168 84 200 52 Z"
                stroke="#C13E12"
                strokeWidth="2.4"
                strokeLinejoin="round"
                fill="#FF8C42"
                fillOpacity="0.14"
                pathLength="1"
                className="alpana-trace"
              />
              {/* Rice-paste inner line of the petal */}
              <path
                d="M200 66 C222 90 226 118 200 140 C174 118 178 90 200 66 Z"
                stroke="#FFFDF9"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="#FFB627"
                fillOpacity="0.18"
                pathLength="1"
                className="alpana-trace"
                style={{ animationDelay: "0.35s" }}
              />
              {/* Petal vein */}
              <path
                d="M200 76 L200 134"
                stroke="#B45309"
                strokeOpacity="0.6"
                strokeWidth="1.4"
                strokeLinecap="round"
                pathLength="1"
                className="alpana-trace"
                style={{ animationDelay: "0.55s" }}
              />
              {/* Tip bindu */}
              <circle
                cx="200"
                cy="44"
                r="3"
                fill="#C13E12"
                className="alpana-pop"
                style={{ animationDelay: "1.6s" }}
              />
            </g>
          </Radial>

          {/* ── Kolka (paisley) sprigs between the big petals ── */}
          <Radial offset={22.5}>
            <g className="alpana-bloom" style={{ animationDelay: "0.5s" }}>
              <path
                d="M200 84 C214 92 216 108 206 118 C200 124 190 122 187 114 C184 107 189 99 196 98 C201 97 202 90 200 84 Z"
                stroke="#EA5420"
                strokeOpacity="0.85"
                strokeWidth="1.8"
                strokeLinejoin="round"
                fill="#FFE6D8"
                fillOpacity="0.5"
                pathLength="1"
                className="alpana-trace"
                style={{ animationDelay: "0.6s" }}
              />
              <circle
                cx="198"
                cy="110"
                r="2.4"
                fill="#F59E0B"
                className="alpana-pop"
                style={{ animationDelay: "1.7s" }}
              />
            </g>
          </Radial>

          {/* ── Middle vine ring with dot pairs ── */}
          <circle
            cx="200"
            cy="200"
            r="128"
            stroke="#FFB627"
            strokeOpacity="0.6"
            strokeWidth="1.4"
            strokeDasharray="10 6"
            pathLength="1"
            className="alpana-trace"
            style={{ animationDelay: "0.8s" }}
          />
          <Radial count={16} offset={11.25}>
            <circle
              cx="200"
              cy="72"
              r="2.2"
              fill="#EA5420"
              fillOpacity="0.7"
              transform="translate(0 66)"
              className="alpana-pop"
              style={{ animationDelay: "1.8s" }}
            />
          </Radial>

          {/* ── Inner lotus: 8 slim petals, rotated half-step ── */}
          <Radial offset={22.5}>
            <g className="alpana-bloom" style={{ animationDelay: "0.7s" }}>
              <path
                d="M200 118 C218 140 218 166 200 182 C182 166 182 140 200 118 Z"
                stroke="#9A320F"
                strokeOpacity="0.8"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="#FFF4EE"
                fillOpacity="0.7"
                pathLength="1"
                className="alpana-trace"
                style={{ animationDelay: "0.85s" }}
              />
              <path
                d="M200 130 C211 146 211 164 200 174 C189 164 189 146 200 130 Z"
                stroke="#FF6B35"
                strokeOpacity="0.7"
                strokeWidth="1.4"
                fill="#FFC9AC"
                fillOpacity="0.35"
                pathLength="1"
                className="alpana-trace"
                style={{ animationDelay: "1.05s" }}
              />
            </g>
          </Radial>

          {/* ── Heart of the flower ── */}
          <g className="alpana-bloom" style={{ animationDelay: "1s" }}>
            <circle
              cx="200"
              cy="200"
              r="34"
              stroke="#C13E12"
              strokeWidth="2.2"
              fill="#FFF8F0"
              pathLength="1"
              className="alpana-trace"
              style={{ animationDelay: "1.1s" }}
            />
            {/* Rice-paste petal rosette inside the heart */}
            <Radial count={8}>
              <path
                d="M200 172 C206 180 206 190 200 196 C194 190 194 172 200 172 Z"
                stroke="#F59E0B"
                strokeOpacity="0.9"
                strokeWidth="1.5"
                fill="#FFE79E"
                fillOpacity="0.55"
                pathLength="1"
                className="alpana-trace"
                style={{ animationDelay: "1.25s" }}
              />
            </Radial>
            <circle
              cx="200"
              cy="200"
              r="9"
              fill="#FF6B35"
              className="alpana-pop"
              style={{ animationDelay: "1.45s" }}
            />
            <circle
              cx="200"
              cy="200"
              r="3.5"
              fill="#FFFDF9"
              className="alpana-pop"
              style={{ animationDelay: "1.55s" }}
            />
          </g>
        </svg>
      </div>

      {/* Wordmark + loading hint */}
      <div className="mt-8 text-center">
        <p className="text-xl font-semibold tracking-[0.3em] text-ink alpana-fade-in">
          PRARAMBH
        </p>
        <p
          className="mt-2 text-xs uppercase tracking-[0.25em] text-ink-muted alpana-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          An auspicious beginning
        </p>
      </div>
    </div>
  );
}
