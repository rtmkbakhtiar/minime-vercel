import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        Onest: ['var(--font-Onest)', 'sans-serif'],
      },
      fontSize: {
        xxs: ['10px', '15px'],
      },
      borderRadius: {
        '10px': '10px',
        '32px': '32px',
      },
      spacing: {
        '18px': '18px',
        '42px': '42px',
      },
      colors: {
        neutral: {
          white: '#FAFAFA',
          background: '#F5F5F5',
        },
        'black-primary': '#434343',
        green: {
          100: '#ECFDF3',
          200: '#e3f3e9',
          500: '#12B76A',
          700: '#027A48',
        },
        purple: {
          50: '#F4F3FF',
          100: '#F9F5FF',
          500: '#7F56D9',
          600: '#6941C6',
          700: '#5925DC',
        },
        gray: {
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#EAECF0',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1D2939',
          900: '#101828',
        },
        blue: {
          50: '#EFF8FF',
          600: '#1570EF',
        },
        warning: {
          50: '#FFFAEB',
          600: '#DC6803',
        },
        orange: {
          50: '#FFF6ED',
          100: '#f5ece4',
          500: '#FB6514',
          600: '#EC4A0A',
          700: '#C4320A',
        },
        pink: {
          50: '#FDF2FA',
          200: '#FCCEEE',
          600: '#DD2590',
          900: '#851651',
        },
        red: {
          100: '#FEF3F2',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
        },
      },
      boxShadow: {
        table:
          '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
        'general-m': '0px 8px 28px 0px rgba(20, 20, 43, 0.1)',
        'general-xs': '0px 2px 6px 0px rgba(20, 20, 43, 0.06)',
        'general-l': '0px 14px 42px 0px rgba(20, 20, 43, 0.14)',
        xs: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        lg: '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
        'describes-checked':
          '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(240, 239, 239, 1)',
        button: '0px 0px 4px 4px rgba(0, 0, 0, 0.1)',
        'input-focus':
          '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(226, 226, 226, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundImage: {
        'midnight-black': 'linear-gradient(180deg, #232526 0%, #434343 100%)',
        'midnight-black-default':
          'linear-gradient(180deg, #434343 100%, #434343 100%)',
        'midnight-black-disabled':
          'linear-gradient(180deg, #989B9D 100%, #989B9D 100%)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    ({ addComponents }: Config['PluginAPI']) => {
      addComponents({
        '.container-center': { '@apply max-w-7xl mx-auto px-4 lg:px-10': {} },
        '.btn-primary-midnight-black': {
          '@apply bg-midnight-black shadow-xs hover:bg-midnight-black-default border border-transparent hover:border-black-primary text-white disabled:border-[#989B9D] disabled:bg-midnight-black-disabled':
            {},
        },
        '.btn-secondary-gray': {
          '@apply bg-white shadow-xs hover:bg-gray-50 border border-gray-300 text-gray-800':
            {},
        },
        '.input-default': {
          '@apply shadow-xs text-gray-800 placeholder:text-gray-500 border border-gray-300 focus:border-gray-800 focus:shadow-input-focus focus:ring-0 focus:outline-none':
            {},
        },
        '.absolute-center': {
          '@apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2':
            {},
        },
      });
    },
  ],
};

export default config;
