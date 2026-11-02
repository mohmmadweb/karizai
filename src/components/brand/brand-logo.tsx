import Image from "next/image";
import { cn } from "@/lib/utils";

const logos = {
  /** Icon above the name. */
  full: { color: "/brand/icon-text.png", white: "/brand/icon-text-white.png", width: 1254, height: 1254 },
  /** Icon only. */
  icon: { color: "/brand/icon.png", white: "/brand/icon-white.png", width: 1114, height: 1114 },
  /** The Kariz mark, without the name. */
  kariz: { color: "/brand/kariz.svg", white: "/brand/kariz-white.svg", width: 100, height: 75 },
  /** Name only. */
  text: { color: "/brand/text.png", white: "/brand/text-white.png", width: 1114, height: 333 },
} as const;

type BrandLogoProps = {
  /** Persian alt text. Pass an empty string when the logo is decorative. */
  alt: string;
  variant?: keyof typeof logos;
  /**
   * `auto` shows the colored logo in the light theme and the white logo in the
   * dark theme. Use `white` on a dark or brand-colored surface in both themes.
   */
  tone?: "auto" | "color" | "white";
  /** Set the size with width utilities, for example `w-12`. Height follows. */
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  alt,
  variant = "icon",
  tone = "auto",
  className,
  priority,
}: BrandLogoProps) {
  const logo = logos[variant];
  const image = (key: "color" | "white", extra?: string) => (
    <Image
      src={logo[key]}
      alt={alt}
      width={logo.width}
      height={logo.height}
      priority={priority}
      className={cn("h-auto w-10 shrink-0", className, extra)}
    />
  );
  if (tone !== "auto") return image(tone);
  return (
    <>
      {image("color", "dark:hidden")}
      {image("white", "hidden dark:block")}
    </>
  );
}
