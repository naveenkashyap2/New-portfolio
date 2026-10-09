# Naveen Kumar — Portfolio (Dark Neomorphism / Soft UI)

React + Tailwind CSS v4 single-file portfolio.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

## Using in YOUR OWN Vite + React + Tailwind v4 project

You only need **two files**:

1. **`src/App.jsx`** — the entire portfolio (self-contained, no props, no external libraries).
   Paste it over your `src/App.jsx`.
2. **`src/index.css`** — the Tailwind v4 `@theme` tokens (colors, neomorphism shadows,
   embossed text-shadow, animations, reduced-motion support). Paste it over your
   `src/index.css` (keep the `@import "tailwindcss";` line).

Also place your resume at **`public/Naveen_Kumar_Resume.pdf`** so the
"⬇ Download CV" buttons work.

Optional: the `index.html` loads Inter from Google Fonts. Without it the
`ui-sans-serif, system-ui` fallbacks are used automatically.

## Customize content

All content lives in the data arrays at the top of `src/App.jsx`:
`ROLES`, `STATS`, `FEATURES`, `SKILLS`, `MINI_PROJECTS`, `MAJOR_PROJECTS`,
`EXPERIENCE`, `EDUCATION`, `CERTIFICATIONS`, `INFO_ROWS`, `CONTACT_ROWS`, `SOCIALS`.

## Neomorphism rules used

- Element background = page background `#252830` — no borders, separation only via dual shadows
- Raised: `shadow-neo-out` (14px dark bottom-right + 14px light top-left)
- Pressed/inset: `shadow-neo-in` (flipped inward)
- Radii: 16px buttons · 20px badges · 28px cards · 36px hero/CTA
- Embossed headings: `text-shadow-emboss`
