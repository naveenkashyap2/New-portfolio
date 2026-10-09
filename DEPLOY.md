# 🚀 Live Deploy Guide — Naveen Portfolio

## 🌍 CURRENT LIVE URL (public, shareable)
**https://tkwvwx.csb.app/**  ← latest deploy (NAVEEN AI mood chatbot + RAG/n8n skills, 9 Oct 2026)
(purane links 7rq9wd / 4fmvnm / w498tr / 4t876q deprecated — sirf naya link use karo)

Production build already ready hai: **`dist/`** folder (resume PDF + photo included ✅).
`site.zip` = deploy-ready zip (Netlify Drop pe drag kar sakte ho).

## Option 1 — Vercel (sabse easy, 1 command) ⭐ recommended
```bash
cd /home/user/naveen-portfolio
npx vercel --prod
```
- Pehli baar browser se Vercel login (GitHub se login kar sakte ho)
- Link milega: `https://<project-name>.vercel.app`
- Har update ke baad bas `npx vercel --prod` dobara chala do

## Option 2 — Netlify Drop (no login, no command, 10 seconds)
1. `dist/` folder already built hai
2. Browser mein kholo: **https://app.netlify.com/drop**
3. `dist/` folder ko page pe **drag karo** → instant live link `https://<random>.netlify.app`

## Option 3 — Netlify CLI
```bash
cd /home/user/naveen-portfolio
npx netlify deploy --prod --dir=dist
```

## Option 4 — GitHub Pages
```bash
cd /home/user/naveen-portfolio
git init && git add -A && git commit -m "portfolio"
gh repo create naveen-portfolio --public --source=. --push
```
Phir GitHub repo → **Settings → Pages** → Branch: `main` → Save.
⚠️ Agar assets 404 karein toh `vite.config.js` mein `base: './'` add karo.

## Local preview (already running)
```bash
cd /home/user/naveen-portfolio
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # dist/ ka production preview
```

## Notes
- Resume PDF: `public/Naveen_Kumar_Resume.pdf` → deploy ke baad `/Naveen_Kumar_Resume.pdf` se download hota hai (Download CV buttons ✅)
- SPA hai (hash anchors `#about`, `#projects`…) — kisi bhi static host pe bina extra config ke kaam karega
