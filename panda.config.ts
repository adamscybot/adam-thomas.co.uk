import { defineConfig, defineTextStyles } from '@pandacss/dev'

export const textStyles = defineTextStyles({
  pageTitle: {
    description: 'Large display text style for feature elements',
    value: {
      fontFamily: 'inter',
      fontWeight: '700',
      fontSize: '5xl',
      lineHeight: '1.1',
    },
  },
  tagline: {
    description: 'Tag line for the large display text',
    value: {
      fontFamily: 'inter',
      fontWeight: '400',
      fontSize: 'lg',
      lineHeight: '1.5',
    },
  },
  body: {
    description: 'Tag line for the large display text',
    value: {
      fontFamily: 'inter',
      fontWeight: '400',
      fontSize: 'md',
      lineHeight: '1.7',
    },
  },
  pageLink: {
    description: 'Main header navigation links',
    value: {
      fontFamily: 'inter',
      fontWeight: '700',
      fontSize: 'sm',
      lineHeight: '1.35',
      textTransform: 'uppercase',
      xs: {
        fontSize: '1rem',
      },
    },
  },
  link: {
    description: 'Inline links',
    value: {
      fontFamily: 'inter',
      fontWeight: '400',
      textDecoration: 'underline',
      _hover: {
        textDecoration: 'none',
      },
    },
  },
  header: {
    description: 'Inline links',
    value: {
      fontFamily: 'inter',
      fontWeight: '600',
      fontSize: '2rem',
    },
  },
  tag: {
    description: 'Text inside of tags/labels',
    value: {
      fontFamily: 'inter',
      fontWeight: '700',
      fontSize: '0.7rem',
      textTransform: 'uppercase',
    },
  }
})

const connector = {
  colors: {
    terminator: { value: '{colors.slate.400}' },
    line: { value: '{colors.slate.600}' },
  },
  sizes: {
    terminator: { value: '{spacing.3}' },
    'terminator-ring': { value: '0.3' },
    'line-width': { value: '2px' },
  },
  spacing: {
    'line-inset': { value: '{spacing.3}' },
    'line-dot-gap': { value: '17px' },
    'terminator-tag-gap': {value: '{spacing.3}'}
  },
}

export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  include: [
    './src/**/*.{ts,tsx,js,jsx,astro}',
    './pages/**/*.{ts,tsx,js,jsx,astro}',
  ],
  exclude: [],
  strictTokens: true,
  theme: {
    extend: {
      textStyles,
      tokens: {
        fonts: {
          inter: { value: "'Inter Variable', sans-serif" },
        },
      },
      semanticTokens: {
        borders: {
          'draw-line': {
            value: {
              width: '1px',
              color: '{colors.slate.400}',
              style: 'solid',
            },
          },
        },
        colors: {
          bg: { value: '{colors.slate.950}' },
          text: {
            pageTitle: { value: '{colors.slate.200}' },
            header: { value: '{colors.slate.200}' },
            tagline: { value: '{colors.slate.300}' },
            body: { value: '{colors.slate.400}' },
            tag: {value: '{colors.slate.300}'}
          },
          connector: {
            ...connector.colors,
          },

        },
        sizes: {
          connector: {
            ...connector.sizes,
          },
        },
        spacing: {
          connector: {
            ...connector.spacing,
          },
          gutter: {
            width: { value: '{spacing.56}' },
            gap: { value: '{spacing.5}' },
          },
        },
      },
      breakpoints: {
        // Width at which nav is on one line with larger padding
        xs: '430px',
        xl: '1200px',
        '2xl': '1320px',
      },
    },
  },
  outdir: 'src/styled-system',
})
