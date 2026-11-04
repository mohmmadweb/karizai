import localFont from "next/font/local";

// Sahel, the font of the Motoshub platform. One variable file carries every weight, so the first
// visit downloads 38KB instead of a file per weight. Open Font License (assets/fonts/Sahel-LICENSE.txt).
export const fontSans = localFont({
  variable: "--font-sans",
  display: "swap",
  fallback: ["Tahoma", "system-ui", "sans-serif"],
  src: [{ path: "../assets/fonts/Sahel-VF.woff2", weight: "300 900", style: "normal" }],
});
