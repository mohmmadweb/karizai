import type { NextConfig } from "next";

/** `STATIC_EXPORT=1` builds plain files for GitHub Pages (see scripts/build-static.sh). */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Static export cannot use partial prerendering, so both stay off there.
  cacheComponents: !staticExport,
  partialPrefetching: !staticExport,
  ...(staticExport ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } } : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
