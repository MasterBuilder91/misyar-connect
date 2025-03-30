// src/app/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        teal: {
          50: '#E6F0F0',
          100: '#CCE0E0',
          200: '#99C2C1',
          300: '#66A3A2',
          400: '#338583',
          500: '#106B69', // Primary brand color
          600: '#0D5654',
          700: '#0A4240', // Darker teal for hover states
          800: '#062B2A',
          900: '#031515',
        },
        amber: {
          50: '#FDF8EF',
          100: '#FBF1DF',
          200: '#F7E3BF',
          300: '#F3D59F',
          400: '#EFC77F',
          500: '#D4A24C', // Warm Gold accent color
          600: '#AA823D',
          700: '#7F612E',
          800: '#55411E',
          900: '#2A200F',
        },
        cream: {
          50: '#FDFCF9',
          100: '#F8F5EB', // Soft Cream background color
          200: '#F1EBD7',
          300: '#EAE1C3',
          400: '#E3D7AF',
          500: '#DCCD9B',
          600: '#B0A47C',
          700: '#847B5D',
          800: '#58523E',
          900: '#2C291F',
        },
        burgundy: {
          500: '#8A2846', // Rich Burgundy for important actions
        },
        slate: {
          500: '#4A6FA5', // Slate Blue for secondary elements
        },
        forest: {
          500: '#2D6A4F', // Forest Green for success states
        },
      },
      fontFamily: {
        sans: ['Inter', 'Tajawal', 'sans-serif'],
        heading: ['Poppins', 'IBM Plex Sans Arabic', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'card': '0px 4px 12px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
