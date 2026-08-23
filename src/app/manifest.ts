import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CASELÉ — Premium Phone Cases in Qatar",
    short_name: "CASELÉ",
    description: "Premium mobile phone cases designed for style and durability. Shop iPhone, Samsung, Huawei cases in Doha, Qatar.",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0D0D",
    theme_color: "#D4AF37",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
