import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import pandacss from '@pandacss/astro'
import vercel from '@astrojs/vercel'
import { remarkAlert } from 'remark-github-blockquote-alert'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import react from '@astrojs/react'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import expressiveCode from 'astro-expressive-code'
import rehypeMermaid from 'rehype-mermaid'
import { lighten, adjust, invert } from 'khroma'

export const mkBorder = (col, darkMode) =>
  darkMode ? adjust(col, { s: -40, l: 10 }) : adjust(col, { s: -40, l: -10 })

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  site: 'https://adam-thomas.co.uk',
  integrations: [
    expressiveCode({
      plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
      themes: ['dracula'],
      styleOverrides: {
        codeFontFamily:
          "'Fira Code Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New'",
      },
    }),
    mdx(),
    pandacss(),
    sitemap(),
    react(),
  ],
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      excludeLangs: ['mermaid'],
    },
    remarkPlugins: [remarkAlert],
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          launchOptions: {
            args: ['--disable-web-security'],
          },
          dark: true,
          mermaidConfig: {
            theme: 'base',
            layout: 'elk',
            elk: {
              mergeEdges: false,
              nodePlacementStrategy: 'SIMPLE',
            },
            fontFamily: 'Inter Variable, sans-serif',
            mirrorActors: false,
            sequence: {
              boxMargin: 20,
              labelBoxWidth: 80,
              labelBoxHeight: 50,
              diagramMarginX: 0,
            },
            // fontSize: '20px',
            // actorFontWeight: '900',,
            themeVariables: {
              // -- core palette (first block) --
              background: '#333',
              primaryColor: '#1f2020',
              secondaryColor: lighten('#1f2020', 16),
              tertiaryColor: adjust('#1f2020', { h: -160 }),

              primaryBorderColor: invert('#333'),
              secondaryBorderColor: mkBorder(lighten('#1f2020', 16), true),
              tertiaryBorderColor: mkBorder(
                adjust('#1f2020', { h: -160 }),
                true,
              ),

              primaryTextColor: invert('#1f2020'),
              secondaryTextColor: invert(lighten('#1f2020', 16)),
              tertiaryTextColor: invert(adjust('#1f2020', { h: -160 })),

              // -- overridden by second block --
              lineColor: 'lightgrey', // this.mainContrastColor
              textColor: '#ccc', // final textColor from first block

              // -- backgrounds & accents --
              mainBkg: '#1f2020',
              secondBkg: lighten('#1f2020', 16), // override from second block
              mainContrastColor: 'lightgrey',
              darkTextColor: lighten(invert('#323D47'), 10),

              border1: '#ccc',
              border2: 'rgba(255, 255, 255, 0.25)',
              arrowheadColor: 'lightgrey', // override from second block

              labelBackground: '#181818',

              // -- actor / signal / label mappings (second block) --
              actorBorder: '#ccc', // this.border1
              actorBkg: '#1f2020', // this.mainBkg
              actorTextColor: 'lightgrey', // this.mainContrastColor
              actorLineColor: '#ccc', // same as actorBorder

              signalColor: '#00c7ff',
              signalTextColor: 'lightgrey',

              labelBoxBkgColor: '#1f2020',
              labelBoxBorderColor: '#ccc',
              labelTextColor: 'lightgrey',
              loopTextColor: 'lightgrey',

              // -- note mappings (second block) --
              noteBorderColor: mkBorder(lighten('#1f2020', 16), true), // this.secondaryBorderColor
              noteBkgColor: '#0f152d', // this.secondBkg
              noteTextColor: invert(lighten('#1f2020', 16)), // this.secondaryTextColor

              // -- activation mappings (second block) --
              activationBorderColor: '#ccc', // this.border1
              activationBkgColor: lighten('#1f2020', 16), // this.secondBkg
            },
          },
        },
      ],
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          content: {
            type: 'text',
            value: '#',
          },
          headingProperties: {
            className: ['anchor'],
          },
          properties: {
            className: ['anchor-link'],
            ariaHidden: 'hidden',
          },
        },
      ],
    ],
  },
})
