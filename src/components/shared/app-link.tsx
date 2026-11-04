"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, FocusEvent, MouseEvent } from "react";

/**
 * Link that fetches its page when the pointer reaches it, not when it scrolls into view.
 * The sidebar alone has dozens of links; prefetching them all slowed every page on a weak connection.
 */
export default function Link({ onMouseEnter, onFocus, ...props }: ComponentProps<typeof NextLink>) {
  const router = useRouter();
  const warm = () => {
    if (typeof props.href === "string" && props.href.startsWith("/")) router.prefetch(props.href);
  };
  return (
    <NextLink
      prefetch={false}
      onMouseEnter={(event: MouseEvent<HTMLAnchorElement>) => { warm(); onMouseEnter?.(event); }}
      onFocus={(event: FocusEvent<HTMLAnchorElement>) => { warm(); onFocus?.(event); }}
      {...props}
    />
  );
}
