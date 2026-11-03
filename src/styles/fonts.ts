import localFont from "next/font/local";

// IRANSansX with built-in Persian digits (FaNum). Only the weights the panels use are loaded,
// so the first visit downloads four files instead of nine.
export const fontSans = localFont({
  variable: "--font-sans",
  display: "swap",
  fallback: ["Tahoma", "system-ui", "sans-serif"],
  src: [
    { path: "../assets/fonts/IRANSansXFaNum-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/IRANSansXFaNum-Medium.woff2", weight: "500" },
    { path: "../assets/fonts/IRANSansXFaNum-DemiBold.woff2", weight: "600" },
    { path: "../assets/fonts/IRANSansXFaNum-Bold.woff2", weight: "700" },
  ],
});
