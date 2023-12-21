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
      fontSize: '0.8rem',
      lineHeight: '1.35',
      textTransform: 'uppercase',
      md: {
        fontSize: '1rem',
      },
    },
  },
  sectionLink: {
    description: 'Main header sub navigation links',
    value: {
      fontFamily: 'inter',
      fontWeight: '900',
      fontSize: '0.7rem',
      lineHeight: '1.35',
      textTransform: 'uppercase',
      md: {
        fontSize: '0.8rem',
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
  },
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
    'terminator-tag-gap': { value: '{spacing.3}' },
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
  hash: true,
  strictTokens: true,
  theme: {
    extend: {
      textStyles,
      tokens: {
        fonts: {
          inter: { value: "'Inter Variable', sans-serif" },
        },
        animations: {
          slideUpStick: { value: 'slideup 0.5s ease forwards' },
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
          nav: {
            overlay: {
              value: 'color-mix(in srgb, {colors.white} 10%, transparent)',
            },
          },
          text: {
            pageTitle: { value: '{colors.slate.200}' },
            header: { value: '{colors.slate.200}' },
            tagline: { value: '{colors.slate.300}' },
            body: { value: '{colors.slate.400}' },
            tag: { value: '{colors.slate.300}' },
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
          nav: {
            buffer: { value: '{spacing.24}' },
          },
          gutter: {
            width: { value: '{spacing.56}' },
            gap: { value: '{spacing.5}' },
          },
        },
        zIndex: {
          nav: { value: '2' },
        },
      },

      breakpoints: {
        xxs: '355px',
        xs: '430px',
        xl: '1200px',
        '2xl': '1320px',
      },

      keyframes: {
        navBlur: {
          '0%': {
            background: 'rgba(255,255,255,0)',
          },
          '100%': {
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
          },
        },
        navSubNavDock: {
          '100%': {
            transform: 'translateY(0)',
          },
        },
        navMask: {
          '100%': {
            opacity: '1',
          },
        },
        'fade-bg-out': {
          '100%': {
            background: 'rgba(0,0,0,0)',
          },
        },

        slideupAnchoredTop: {
          '0%': {
            transform: 'translateY(calc(100dvh + 100%))',
          },
          '100%': {
            transform: 'translateY(calc(100dvh - 20px))',
          },
        },
        slideup: {
          '0%': {
            transform: 'translateY(100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },

        slideupPrimaryNav: {
          '100%': {
            transform: 'translateY(0)',
          },
        },
        slideupSubNav: {
          '100%': {
            transform: 'translateY(-80px)',
          },
        },

        slidedown: {
          '0%': {
            transform: 'translateY(-100%)',
          },
          '100%': {
            transform: 'translateY(0%)',
          },
        },
      },
    },
  },
  conditions: {
    extend: {
      oneHanded:
        '@media (pointer:coarse) and (max-device-width: token(breakpoints.xs))',
      notOneHanded:
        '@media not ((pointer:coarse) and (max-device-width: token(breakpoints.xs)))',
      supportsAnimationTimeline: '@supports (animation-timeline: view())',
      noAnimationTimeline: '@supports not (animation-timeline: view())',
    },
  },
  outdir: 'src/styled-system',
})
