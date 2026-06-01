import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D1B3E',
        accent: '#84CC16',
        navy: '#0D1B3E',
        lime: '#84CC16',
      },
    },
  },
  plugins: [],
}
export default config
