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

// Extensions
import compress from "astro-compress";
import metaTags from "astro-meta-tags";

// https://astro.build/config
export default defineConfig({
  site: "https://marban.is-a.dev",
  output: "hybrid",
  adapter: cloudflare({
    imageService: "cloudflare",
    runtime: {
      mode: "local",
      type: "pages",
      bindings: {
        GTOKEN: {
          type: "var",
          value: process.env.GTOKEN,
        },
      },
    },
  }),
  vite: {
    define: {
      "process.env.GTOKEN": JSON.stringify(process.env.GTOKEN),
    },
    ssr: {
      noExternal: ["react-icons"],
    },
  },
  integrations: [
    sitemap(),
    react(),
    metaTags(),
    mdx({
      gfm: true,
      optimize: true,
      remarkPlugins: [
        [
          remarkToc,
          {
            heading: "contents",
          },
        ],
      ],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
          },
        ],
        [
          rehypeToc,
          {
            headings: ["h2", "h3"],
          },
        ],
        rehypeAccessibleEmojis,
      ],
    }),
    compress(),

  ],
  markdown: {
    syntaxHighlight: "shiki",
    remarkPlugins: [
      [
        remarkToc,
        {
          heading: "contents",
        },
      ],
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
        },
      ],
      [
        rehypeToc,
        {
          headings: ["h2", "h3"],
        },
      ],
      rehypeAccessibleEmojis,
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    gfm: true,
  },
});
