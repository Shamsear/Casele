import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: "#FAFAFA",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#0A0A0A",
          fontFamily: "Georgia, serif",
          fontWeight: "bold",
          letterSpacing: "0.2em",
        }}
      >
        <div style={{ fontSize: 44, color: "#A88B4D", marginBottom: 6 }}>👑</div>
        <div>CASELÉ</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
