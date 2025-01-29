import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}", // ✅ Ensures Tailwind scans App Router files
    "./src/components/**/*.{ts,tsx,mdx}", // ✅ Scans reusable components
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
  mode: "jit", // ✅ Ensure JIT mode is enabled
} satisfies Config;
