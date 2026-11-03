import Image from "next/image";
import { cn } from "@/lib/utils";

/** People who have a photo in `public/people`, by id; everyone else gets the drawn picture. */
const photos = new Set(["user-1", "user-2", "col-ali", "col-sara", "col-reza", "col-narges", "col-mohammad", "col-mehdi"]);

/** Illustration colours for profile pictures. They are picture content, not interface colours. */
const backgrounds = ["#dbeafe", "#fde68a", "#bbf7d0", "#fbcfe8", "#ddd6fe", "#fed7aa", "#bae6fd"];
const skins = ["#f2c9a0", "#e0a878", "#c68863", "#a66a47", "#f6d7b8"];
const hairs = ["#1f1a17", "#3b2a20", "#6b4a2f", "#8a8a8a", "#2c2c34"];
const shirts = ["#1e3a5f", "#2f6f6a", "#7a3b4a", "#4a4a8a", "#5c6b2f", "#8a5a2b"];

function hash(text: string): number {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

const pick = <T,>(list: T[], seed: number, shift: number): T => list[(seed >>> shift) % list.length];

/** A profile picture drawn from the person's id, so the same person always looks the same. Photos in `public/people` replace it for the demo users. */
export function PersonAvatar({ seed, name, className }: { seed: string; name: string; className?: string }) {
  if (photos.has(seed)) {
    return (
      <span className={cn("inline-flex size-8 shrink-0 overflow-hidden rounded-full", className)}>
        <Image src={`/people/${seed}.jpg`} alt={`تصویر ${name}`} width={256} height={256} className="size-full object-cover" />
      </span>
    );
  }
  const h = hash(seed);
  const skin = pick(skins, h, 3);
  const hair = pick(hairs, h, 7);
  const style = (h >>> 11) % 4;
  return (
    <span className={cn("inline-flex size-8 shrink-0 overflow-hidden rounded-full", className)}>
      <svg viewBox="0 0 64 64" role="img" aria-label={`تصویر ${name}`} className="size-full">
        <rect width="64" height="64" fill={pick(backgrounds, h, 0)} />
        {style === 1 ? <path d="M17 30c0-14 6-20 15-20s15 6 15 20v16H17z" fill={hair} /> : null}
        <path d="M6 64c0-14 11-19 26-19s26 5 26 19z" fill={pick(shirts, h, 15)} />
        <rect x="28" y="36" width="8" height="10" rx="3" fill={skin} />
        <ellipse cx="32" cy="27" rx="11" ry="12.5" fill={skin} />
        {style === 0 ? <path d="M20.5 25c0-9 5-13.5 11.5-13.5S43.5 16 43.5 25c-3-4-7-6-11.5-6s-8.5 2-11.5 6z" fill={hair} /> : null}
        {style === 1 ? <path d="M20.5 26c0-9 5-14 11.5-14s11.5 5 11.5 14c-4-1-8-5-11.5-8-2.5 4-6 7-11.5 8z" fill={hair} /> : null}
        {style === 2 ? <><path d="M20.5 24c1-8 6-12 11.5-12s10.5 4 11.5 12c-3-3-7-4-11.5-4s-8.5 1-11.5 4z" fill={hair} /><path d="M22 31c1 8 5 11 10 11s9-3 10-11c-2 3-5 4-10 4s-8-1-10-4z" fill={hair} opacity="0.85" /></> : null}
        {style === 3 ? <path d="M21 22c2-6 6-9 11-9s9 3 11 9c-4-2-7-3-11-3s-7 1-11 3z" fill={hair} /> : null}
        <circle cx="27.5" cy="27.5" r="1.1" fill="#2b2b2b" />
        <circle cx="36.5" cy="27.5" r="1.1" fill="#2b2b2b" />
        <path d="M28.5 33c1.2 1.2 5.8 1.2 7 0" stroke="#7a4a3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>
    </span>
  );
}
