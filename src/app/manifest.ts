import type { MetadataRoute } from "next";
import { PROFILE } from "@/data/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PROFILE.name} — ${PROFILE.headline}`,
    short_name: "ISMAIL.DEV",
    description: PROFILE.summary[0],
    start_url: "/",
    display: "standalone",
    background_color: "#05070a",
    theme_color: "#05070a",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
