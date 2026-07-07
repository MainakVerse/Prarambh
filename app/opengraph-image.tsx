import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = `${site.name} — every project stage, one workspace`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #FFFDF9 0%, #FFF8F0 55%, #FFE6D8 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #FF8C42, #FF6B35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "30px",
              fontWeight: 800,
            }}
          >
            प्र
          </div>
          <div style={{ fontSize: "40px", fontWeight: 700, color: "#1A1A1A" }}>
            Prarambh
          </div>
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#1A1A1A",
            lineHeight: 1.15,
            maxWidth: "900px",
          }}
        >
          From Prarambh to launch — every project stage, one workspace
        </div>
        <div
          style={{
            marginTop: "32px",
            fontSize: "28px",
            color: "#52525B",
            maxWidth: "820px",
          }}
        >
          13 stages. 5 phases. Stage gates, auto-generated documents, and
          sign-offs — in one place.
        </div>
      </div>
    ),
    size
  );
}
