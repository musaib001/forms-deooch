import { ImageResponse } from "next/og";

// Site-wide default social share image, inherited by every route that doesn't
// define its own. 1200x630 is the standard OG/Twitter card size.
export const alt = "deoochform — AI-native form builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          background: "#1c1917",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#ea580c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            d
          </div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>deoochform</div>
        </div>
        <div style={{ marginTop: 48, fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 960 }}>
          Powerful forms that build themselves.
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#a8a29e", maxWidth: 900 }}>
          Describe a form in plain English — collect responses and export to Excel.
        </div>
      </div>
    ),
    { ...size },
  );
}
