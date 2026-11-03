import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { DirectionProvider } from "@/components/ui/direction";
import { themeInitScript } from "@/lib/use-theme";
import { fontSans } from "@/styles/fonts";
import { SharedProviders } from "./shared-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "کاریز",
  description: "کاریز، پنجره‌ی یکپارچه‌ی هوش مصنوعی سازمان",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${fontSans.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <DirectionProvider direction="rtl">
          <SharedProviders>{children}</SharedProviders>
          <Toaster dir="rtl" position="bottom-center" />
        </DirectionProvider>
      </body>
    </html>
  );
}
