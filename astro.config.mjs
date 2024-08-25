import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import keystatic from "@keystatic/astro";
import markdoc from "@astrojs/markdoc";

import vercel from "@astrojs/vercel/serverless";
import vercelServerless from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    keystatic(),
    markdoc(),
  ],
  output: "server",
  adapter: vercelServerless({
    maxDuration: 8,
    webAnalytics: {
      enabled: false,
    },
  }),
});
