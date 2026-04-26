import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "64px",
        background:
          "linear-gradient(135deg, #f8f7f2 0%, #e8efd8 52%, #d2e0b5 100%)",
        color: "#1f3d2d",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Roshal Organic
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "860px",
        }}
      >
        <div
          style={{
            fontSize: 82,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          Pure organic food for everyday Bangladeshi homes.
        </div>
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.4,
            opacity: 0.84,
          }}
        >
          Honey, ghee, jaggery, oils, seasonal fruits, and a content-managed
          storefront from Roshal Organic.
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
