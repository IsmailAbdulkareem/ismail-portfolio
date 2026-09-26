import { ImageResponse } from "next/og";
import { PROFILE } from "@/data/profile";

// Default social preview for every page that doesn't define its own.
export const alt = `${PROFILE.name} — ${PROFILE.headline}`;
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
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 78% 45%, #0c2a3d 0%, #05070a 55%)",
          color: "#f3f5f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#8a93a3" }}>
          ISMAIL<span style={{ color: "#56c7ff" }}>.DEV</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 8, color: "#56c7ff", textTransform: "uppercase" }}>
            {PROFILE.headline}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>
            <span>BUILDING INTELLIGENT</span>
            <span style={{ color: "#bae6fd" }}>DIGITAL EXPERIENCES.</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8a93a3" }}>
          {PROFILE.name} · AI chatbots · Automation · RAG & AI agents · {PROFILE.location.city}
        </div>
      </div>
    ),
    size,
  );
}
