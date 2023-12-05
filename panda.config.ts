import { defineConfig, defineTextStyles } from "@pandacss/dev";

export const textStyles = defineTextStyles({
    pageTitle: {
      description: 'Large display text style for feature elements',
      value: {
        fontFamily: 'inter',
        fontWeight: '700',
        fontSize: '3rem',
        lineHeight: '1.1',
      }
    },
    tagline: {
      description: 'Tag line for the large display text',
      value: {
        fontFamily: 'inter',
        fontWeight: '400',
        fontSize: '1.1rem',
        lineHeight: '1.5',
      }
    },
    body: {
      description: 'Tag line for the large display text',
      value: {
        fontFamily: 'inter',
        fontWeight: '400',
        fontSize: '0.95rem',
        lineHeight: '1.7',
      }
    },
    headerLink: {
      description: 'Main header navigation links',
      value: {
        fontFamily: 'inter',
        fontWeight: '700',
        fontSize: '0.9rem',
        lineHeight: '1.35',
        textTransform: 'uppercase',
        xs: {
          fontSize: '1rem',
        }
      }
    },
    link: {
      description: 'Inline links',
      value: {
        fontFamily: 'inter',
        fontWeight: '400',
        textDecoration: 'underline',
        _hover: {
          textDecoration: 'none'
        }
      }
    },
    header: {
      description: 'Inline links',
      value: {
        fontFamily: 'inter',
        fontWeight: '600',
        fontSize: '1.05rem',
        textTransform: 'uppercase'
      }
    }
})



export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{ts,tsx,js,jsx,astro}', './pages/**/*.{ts,tsx,js,jsx,astro}'],
  exclude: [],
  theme: {
    extend: {
      textStyles,
      tokens: {
        fonts: {
          inter: {value: "'Inter Variable', sans-serif"}
        }
      },
      semanticTokens: {
        colors: {
          bg: { value: '{colors.slate.950}' },
          text: {
            pageTitle: { value: '{colors.slate.200}'},
            header: { value: '{colors.slate.200}'},
            tagline: { value: '{colors.slate.300}'},
            body: { value: '{colors.slate.400}'},
          }
        }
      },
      breakpoints: {
        // Width at which nav is on one line with larger padding
        xs: '430px',
        // Width at which the left hand gutter design feature becomes
        // available.
        '2xl': '1450px'
      }
    },

  },
  outdir: "src/styled-system",
});
