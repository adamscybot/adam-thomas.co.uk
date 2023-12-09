import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pandacss from '@pandacss/astro';
import vercel from '@astrojs/vercel/static';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  site: 'https://adam-thomas.co.uk',
  integrations: [mdx(), pandacss(), sitemap(), react()],
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  })
});