import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#E5FAFA',
          100: '#B3F0F0',
          200: '#80E6E6',
          300: '#4DDBDB',
          400: '#1AD1D1',
          DEFAULT: '#00CCCC',
          500: '#00CCCC',
          600: '#00AAAA',
          700: '#008888',
          800: '#006666',
          900: '#004444',
        },
        mauve: {
          50:  '#FAF0F3',
          100: '#F0D8DF',
          200: '#E0B1BF',
          300: '#D08A9F',
          400: '#C57F93',
          DEFAULT: '#BA7587',
          500: '#BA7587',
          600: '#A05E72',
          700: '#86475D',
          800: '#6C3048',
          900: '#521933',
        },
        gold: {
          50:  '#FBF6EC',
          100: '#F5E9CE',
          200: '#EDD49D',
          300: '#E4BE6C',
          DEFAULT: '#C9A96E',
          400: '#C9A96E',
          500: '#B8924A',
          600: '#9A7838',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          50:  '#1A1A1A',
          100: '#111111',
          200: '#0D0D0D',
          300: '#0A0A0A',
        },
        cream: {
          DEFAULT: '#FAFAF8',
          50:  '#FAFAF8',
          100: '#F5F3EF',
          200: '#EDE9E3',
          300: '#E5DFD7',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        '10xl': ['10rem', { lineHeight: '1' }],
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.35em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'luxury': '0 4px 40px -8px rgba(0, 0, 0, 0.12)',
        'luxury-lg': '0 8px 60px -12px rgba(0, 0, 0, 0.18)',
        'teal-glow': '0 0 40px -8px rgba(0, 204, 204, 0.3)',
        'mauve-glow': '0 0 40px -8px rgba(186, 117, 135, 0.35)',
        'gold-glow': '0 0 30px -8px rgba(201, 169, 110, 0.4)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
