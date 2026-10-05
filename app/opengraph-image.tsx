import { ImageResponse } from "next/og";

export const alt = "Geometry Dash Spam — Spam, Wave and CPS browser practice tools";
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
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#020617",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: 260,
            right: -40,
            top: 55,
            display: "flex",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.55) 0%, rgba(37,99,235,0.10) 55%, rgba(2,6,23,0) 72%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 720,
            paddingLeft: 86,
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#60a5fa",
              marginBottom: 20,
            }}
          >
            GEOMETRY DASH
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: -3,
              marginBottom: 28,
            }}
          >
            SPAM
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#cbd5e1",
              marginBottom: 18,
            }}
          >
            Spam · Wave · CPS
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 25,
              color: "#94a3b8",
            }}
          >
            Browser practice tools & source-checked GD guides
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 48,
              padding: "14px 22px",
              border: "2px solid #1e3a8a",
              borderRadius: 18,
              background: "#0f172a",
              color: "#bfdbfe",
              fontSize: 21,
              fontWeight: 700,
              width: 310,
            }}
          >
            geometrydashspam.cc
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 118,
            top: 151,
            width: 330,
            height: 330,
            borderRadius: 80,
            border: "3px solid rgba(96,165,250,0.4)",
            background: "#020617",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 55px rgba(37,99,235,0.45)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 220,
              height: 220,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 150,
                height: 96,
                left: 10,
                top: 62,
                opacity: 0.28,
                background: "#3b82f6",
                clipPath: "polygon(0 0, 100% 50%, 0 100%, 30% 50%)",
                display: "flex",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 150,
                height: 96,
                left: 46,
                top: 62,
                opacity: 0.55,
                background: "#3b82f6",
                clipPath: "polygon(0 0, 100% 50%, 0 100%, 30% 50%)",
                display: "flex",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 155,
                height: 104,
                left: 79,
                top: 58,
                background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                border: "8px solid white",
                clipPath: "polygon(0 0, 100% 50%, 0 100%, 29% 50%)",
                display: "flex",
              }}
            />
          </div>
        </div>
      </div>
    ),
    size
  );
}
