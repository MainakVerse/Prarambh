import { cn } from "@/lib/cn";

/**
 * Rajasthani embroidery border pinned to a page edge. The repeating tile
 * stacks classic motifs — shisha (mirror-work) with buttonhole stitches,
 * kairi (paisley), bandhani dot clusters, a peacock-feather eye — between
 * a temple zigzag thread and a mehrab-scalloped inner edge. Rendered in
 * the warm brand palette with hot-pink and teal folk accents at low
 * opacity. Purely ornamental: aria-hidden, no pointer events, xl+ only.
 */
function EmbroideryStrip({ side }: { side: "left" | "right" }) {
  const patternId = `embroidery-${side}`;
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-y-0 z-40 hidden w-10 xl:block",
        side === "left" ? "left-0" : "right-0 -scale-x-100"
      )}
    >
      <svg className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern
            id={patternId}
            width="40"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            {/* Temple zigzag thread (outer edge) */}
            <polyline
              points="5,0 9,10 5,20 9,30 5,40 9,50 5,60 9,70 5,80 9,90 5,100 9,110 5,120 9,130 5,140 9,150 5,160 9,170 5,180 9,190 5,200"
              fill="none"
              stroke="#C13E12"
              strokeOpacity="0.35"
              strokeWidth="1.2"
            />

            {/* Running stitch beside the motifs */}
            <line
              x1="31"
              y1="0"
              x2="31"
              y2="200"
              stroke="#B45309"
              strokeOpacity="0.25"
              strokeWidth="1"
              strokeDasharray="5 4"
            />

            {/* Mehrab scalloped inner edge (period 25) */}
            <path
              d="M40 0 Q33 12.5 40 25 Q33 37.5 40 50 Q33 62.5 40 75 Q33 87.5 40 100 Q33 112.5 40 125 Q33 137.5 40 150 Q33 162.5 40 175 Q33 187.5 40 200"
              fill="none"
              stroke="#FF8C42"
              strokeOpacity="0.4"
              strokeWidth="1.2"
            />

            {/* Shisha mirror-work: mirror disc ringed by buttonhole stitches */}
            <g transform="translate(18 25)">
              <circle r="8.5" fill="none" stroke="#C13E12" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 2.5" />
              <circle r="5.5" fill="#FFF8F0" stroke="#FFB627" strokeOpacity="0.75" strokeWidth="1.5" />
              <circle r="2" fill="#0D9488" fillOpacity="0.35" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="-6.5"
                  x2="0"
                  y2="-9.5"
                  transform={`rotate(${deg})`}
                  stroke="#EA5420"
                  strokeOpacity="0.55"
                  strokeWidth="1.3"
                />
              ))}
            </g>

            {/* Kairi (paisley) with inner stitch outline and curl */}
            <g transform="translate(18 72)">
              <path
                d="M0 -12 C8 -10 11 0 6 8 C3 13 -4 14 -8 9 C-11 5 -9 -2 -4 -6 C-2 -8 1 -10 0 -12 Z"
                fill="#FF8C42"
                fillOpacity="0.4"
                stroke="#C13E12"
                strokeOpacity="0.45"
                strokeWidth="1"
              />
              <path
                d="M0 -7 C5 -6 7 0 4 5 C1 8 -3 8 -5 5 C-7 2 -5 -3 -2 -5"
                fill="none"
                stroke="#9A320F"
                strokeOpacity="0.4"
                strokeWidth="0.9"
                strokeDasharray="2 1.5"
              />
              <circle cx="0" cy="0" r="1.8" fill="#D81B60" fillOpacity="0.45" />
              <path
                d="M0 -12 C2 -15 6 -15 8 -13"
                fill="none"
                stroke="#C13E12"
                strokeOpacity="0.45"
                strokeWidth="1.1"
              />
            </g>

            {/* Bandhani tie-dye dot cluster (diamond of five) */}
            <g transform="translate(18 118)">
              {[
                [0, -6],
                [6, 0],
                [0, 6],
                [-6, 0],
                [0, 0],
              ].map(([x, y]) => (
                <g key={`${x},${y}`} transform={`translate(${x} ${y})`}>
                  <circle r="2.2" fill="#D81B60" fillOpacity="0.4" />
                  <circle r="0.8" fill="#FFF8F0" fillOpacity="0.9" />
                </g>
              ))}
            </g>

            {/* Peacock-feather eye with barbs */}
            <g transform="translate(18 165)">
              {[-60, -30, 0, 30, 60].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="-8"
                  x2="0"
                  y2="-13"
                  transform={`rotate(${deg})`}
                  stroke="#0D9488"
                  strokeOpacity="0.4"
                  strokeWidth="1.1"
                />
              ))}
              <ellipse rx="6.5" ry="9" fill="#0D9488" fillOpacity="0.3" />
              <ellipse rx="4" ry="6" fill="#FFB627" fillOpacity="0.55" />
              <circle r="2" fill="#C13E12" fillOpacity="0.6" />
            </g>

            {/* Seed stitches scattered between motifs */}
            <circle cx="8" cy="48" r="1" fill="#FF8C42" fillOpacity="0.45" />
            <circle cx="28" cy="95" r="1" fill="#D81B60" fillOpacity="0.35" />
            <circle cx="8" cy="142" r="1" fill="#FFB627" fillOpacity="0.5" />
            <circle cx="28" cy="188" r="1" fill="#FF8C42" fillOpacity="0.45" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

export function Embroidery() {
  return (
    <>
      <EmbroideryStrip side="left" />
      <EmbroideryStrip side="right" />
    </>
  );
}
