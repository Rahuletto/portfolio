import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";
// import vercel from "@astrojs/vercel/serverless";
import cloudflare from '@astrojs/cloudflare';

// Remark
import remarkToc from "remark-toc";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeToc from "rehype-toc";

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  vite: {
    ssr: {
      noExternal: ["react-icons"],
    },
  },
  site: "https://marban.is-a.dev",
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
