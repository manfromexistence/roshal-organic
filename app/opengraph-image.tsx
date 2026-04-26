import { ImageResponse } from "next/og";

// Edge runtime is used for OG image generation for better performance
// This warning is expected and intentional - OG images are dynamically generated
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
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: "bold",
          marginBottom: 24,
        }}
      >
        Quadra EDMS
      </div>
      <div
        style={{
          fontSize: 32,
          opacity: 0.8,
        }}
      >
        Enterprise Document Management System
      </div>
    </div>,
    {
      ...size,
    },
  );
}
