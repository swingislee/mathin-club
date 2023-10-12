import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'sl': {'raw': '(orientation: landscape)'},
      'tp': {'raw': '(min-width: 480px) and (orientation: portrait)'},
      'tl': {'raw': '(min-width: 768px) and (orientation: landscape)'},
      'dl': {'raw': '(min-width: 1100px) and (orientation: landscape)'},
      'dp': {'raw': '(min-width: px) and (orientation: portrait)'},
    },
    extend: {
    },
  },
  plugins: [
    function({ addVariant, e }) {
      addVariant('en', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {return `[data-lang="en"] .en\\:${className}`;});
      });
    },
  ],
}
export default config
