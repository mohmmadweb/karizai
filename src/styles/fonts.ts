import localFont from "next/font/local";

// IRANSansX with built-in Persian digits (FaNum). Static files, one per weight.
export const fontSans = localFont({
  variable: "--font-sans",
  display: "swap",
  fallback: ["Tahoma", "system-ui", "sans-serif"],
  src: [
    { path: "../assets/fonts/IRANSansXFaNum-Thin.woff2", weight: "100" },
    { path: "../assets/fonts/IRANSansXFaNum-UltraLight.woff2", weight: "200" },
    { path: "../assets/fonts/IRANSansXFaNum-Light.woff2", weight: "300" },
    { path: "../assets/fonts/IRANSansXFaNum-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/IRANSansXFaNum-Medium.woff2", weight: "500" },
    { path: "../assets/fonts/IRANSansXFaNum-DemiBold.woff2", weight: "600" },
    { path: "../assets/fonts/IRANSansXFaNum-Bold.woff2", weight: "700" },
    { path: "../assets/fonts/IRANSansXFaNum-ExtraBold.woff2", weight: "800" },
    { path: "../assets/fonts/IRANSansXFaNum-Black.woff2", weight: "900" },
  ],
});
