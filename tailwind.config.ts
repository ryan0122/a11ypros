import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import colors from "tailwindcss/colors";

export default {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./wp-classes.txt", // ✅ Scans this file for classes found in WordPress content
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // We define brand here. Standard colors like 'slate' are inherited 
        // automatically unless you overwrite the top-level 'colors' key.
        brand: {
          light: '#f9f8f2',
          dark: '#001d2f',
          primary: '#0E8168',
          accent: '#d4e300',
          border: '#ccd2d5',
        },
      },
    },
  },
  plugins: [typography],
  safelist: [
    // Explicit strings are the most reliable way to force Tailwind 
    // to include these in the CSS bundle for Headless WP content.
    'bg-brand-primary',
    'text-brand-primary',
    'bg-brand-light',
    'text-brand-dark',
    'bg-slate-50',
    'bg-slate-100',
    'bg-slate-200',
    'bg-slate-300',
    'bg-slate-400',
    'bg-slate-500',
    'bg-slate-600',
    'bg-slate-700',
    'bg-slate-800',
    'bg-slate-900',
    'text-slate-500',
    'text-slate-600',
    'text-slate-700',
    'text-slate-800',
    'text-slate-900',
    // Fallback pattern for any missed ranges
    {
      pattern: /(bg|text|border|ring|fill|stroke)-(slate|gray|brand|primary|accent|error|success|warning|info|neutral|stone|zinc|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|red|orange|amber|yellow|lime|green)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
} satisfies Config;