import type { MetadataRoute } from "next";

// Built as a plain file so it works on the static export (GitHub Pages).
export const dynamic = "force-static";

/** Lets the browser install Kariz as an app (no service worker). Colours: `--primary` and `--background` of design.md. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "کاریز — پنجره‌ی یکپارچه‌ی هوش مصنوعی سازمان",
    short_name: "کاریز",
    description: "دستیار هوشمند، عامل‌ها، جریان‌ها و پیام‌رسان سازمان در یک جا.",
    lang: "fa",
    dir: "rtl",
    start_url: "/chat/",
    scope: "/",
    display: "standalone",
    background_color: "#e9f1fd",
    theme_color: "#143065",
    icons: [
      { src: "/brand/icon.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
    ],
  };
}
