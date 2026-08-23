import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0D0D0D",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontFamily: "Georgia, serif",
            fontWeight: "bold",
            color: "#D4AF37",
            marginBottom: "20px",
          }}
        >
          CASELÉ
        </div>
        <div
          style={{
            fontSize: 28,
            fontFamily: "sans-serif",
            color: "#A89B8C",
            marginBottom: "30px",
          }}
        >
          Premium Phone Cases in Qatar
        </div>
        <div
          style={{
            fontSize: 20,
            fontFamily: "sans-serif",
            color: "#666",
          }}
        >
          Protect. Express. Elevate.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
