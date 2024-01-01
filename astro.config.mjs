import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// Remark
import remarkToc from "remark-toc";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeToc from "rehype-toc";

export default defineConfig({
  site: "https://marban.pages.dev",
  output: "hybrid",
  adapter: cloudflare({
    imageService: "cloudflare",
    runtime: {
      mode: "local",
      type: "pages",
      bindings: {
        "GTOKEN": {
          type: "var",
          value: process.env.GTOKEN
        }
      }
    },
  }),
  vite: {
    define: {
      'process.env.GTOKEN': JSON.stringify(process.env.GTOKEN)
    },
    ssr: {
      noExternal: ["react-icons"],
    },
  },
  integrations: [mdx({ gfm: true }), sitemap(), react()],
  markdown: {
    syntaxHighlight: "shiki",
    remarkPlugins: [[remarkToc, { heading: "contents" }]],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [rehypeToc, { headings: ["h2", "h3"] }],
      rehypeAccessibleEmojis,
    ],

    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    gfm: true,
  },
});
