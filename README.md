# E-Waste Wise India

A modern, education-first web app that helps people **understand e-waste**, **estimate environmental impact**, and **find verified recycling centers across India**.

Built with **React + TypeScript + Vite**, **Tailwind/shadcn UI**, **Framer Motion**, and optional **OpenAI** back-end helpers. Maps use Google Places/Maps.

---

## ✨ Core Features

* **Impact Demo**

  * Device dropdown with pretty labels (e.g., “Laptop / Desktop”, “Mobile / Tablet”, …)
  * **Animated** stats (count-up) for CO₂, water, energy, metals, recycling rate, lifecycle CO₂
  * Hazards, impact note, and **disposal guidance**
  * Subtle confetti on first result (respects “reduced motion”)
  * Recent classifications (localStorage, de-duped)

* **Recycling Centers**

  * Curated list of verified centers (India)
  * Search + city filter; **pagination** (10 per page)
  * Clean **vertical cards**: Name → City/Verified → Phone → “View Map”
  * “View Map” embeds **Places search** (no hardcoded map links)

* **Education**

  * Four themed sections rendered as **colorful flashcards**
  * Bottom-right **“Did you know?”** floating button opens a **manual** Next/Previous facts panel (no auto-rotation)

* **Design System**

  * HSL/brand tokens, soft glass surfaces, gradient accents
  * shadcn/ui components with Tailwind utilities
  * Dark/Light theme with system preference
  * Accessible by default (focus rings, ARIA labels, keyboard navigation)

---

## 🧱 Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **UI:** Tailwind CSS, shadcn/ui (Radix under the hood), Lucide icons
* **Animation:** Framer Motion (reduced-motion support)
* **Data & State:** JSON content, React hooks, localStorage
* **Maps:** Google Maps **Places** (text query)
* **(Optional) AI:** OpenAI Responses API via small Express server for:

  * Free-text device **classification** into supported labels
  * “**Explain this impact**” markdown summary
  * **Grounded chat** (SSE streaming) over local JSON context

---

## 📁 Project Structure (high-level)

```
e-waste-wise-india/
├─ src/
│  ├─ components/
│  │  ├─ Demo.tsx
│  │  ├─ ImpactCard.tsx
│  │  ├─ CenterCard.tsx
│  │  ├─ CenterMap.tsx
│  │  ├─ DidYouKnowFab.tsx
│  │  ├─ DidYouKnowPanel.tsx
│  │  └─ ui/ (Section, Surface, GradientText, etc.)
│  ├─ pages/
│  │  ├─ Index.tsx            # Home
│  │  ├─ Education.tsx
│  │  └─ RecyclingCenters.tsx
│  ├─ data/
│  │  ├─ impact_factors.json
│  │  ├─ recycling_centers_in.json
│  │  └─ facts.json
│  ├─ lib/ (a11y, motion, helpers)
│  └─ index.css
├─ server/ (optional OpenAI gateway)
│  └─ index.ts
├─ public/
├─ LICENSE                    # MIT
└─ README.md
```

---

## 🔧 Getting Started

### Prerequisites

* **Node.js ≥ 18** and **npm** (or pnpm/yarn)
* **Google Maps Places API key** with Maps Embed/Places Search enabled
* *(Optional)* **OpenAI API key** if you enable the AI server

### 1) Install

```bash
npm install
```

### 2) Environment

Create `.env` at the project root:

```dotenv
# Frontend
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_PLACES_API_KEY

# Optional OpenAI server (do NOT prefix with VITE_)
OPENAI_API_KEY=sk-...
OPENAI_MODEL_CHAT=gpt-4o
OPENAI_MODEL_CLASSIFY=gpt-4o-mini
```

> Keep `OPENAI_API_KEY` **server-only**. Never commit `.env`.

### 3A) Run (Frontend only)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 3B) Run with AI server (optional)

```bash
npm run dev:server   # starts Express
npm run dev          # runs server + Vite together if configured with concurrently
```

### 4) Build

```bash
npm run build
```

---

## 📊 Data Files (JSON)

* **`impact_factors.json`** — array of device categories with full metrics:

  * `label`, `co2_kg`, `water_liters`, `energy_kwh`, `metals{...}`, `monetary_value_usd`, `global_recycling_rate_pct`, `lifecycle_co2_kg`, `hazards[]`, `note`, `disposal_guidance`
* **`recycling_centers_in.json`** — array of centers:

  * `name`, `city`, `verified`, `address`, `phone`, `maps_link` *(not used directly; we query Places by text)*
* **`facts.json`** — array of `{ id, fact, icon }` used in Education + FAB panel

> Updating these files updates the site content without code changes.

---

## 🗺️ Maps Behavior

* The app **never** opens hardcoded map URLs.
* “View Map” triggers an embedded map using **Places text query**:

  ```
  `${name}, ${address}, ${city}, India`
  ```
* Make sure your key allows the relevant Maps/Places APIs and your domain is whitelisted.

---

## 🤖 Optional AI Integration

If the optional server is enabled:

* **POST `/api/ai/classify`** — classify free-text device into an allowed `label`
* **POST `/api/ai/explain-impact`** — markdown explanation grounded in `impact_factors.json`
* **POST `/api/ai/ask`** — **SSE** chat over context: impact + subset of centers + facts

All responses are **grounded**; if context is missing, the server replies “I don’t know” and suggests using the Centers page. The API key is not exposed to the browser.

---

## ♿ Accessibility

* Keyboard focus is visible everywhere (brand focus ring)
* Components use ARIA labels and semantic markup
* Respects user **prefers-reduced-motion**
* Color contrast tuned for readability in light/dark themes

---

## 🚀 Performance

* Vite + React fast refresh
* Tree-shaken shadcn/ui imports
* Lazy maps, minimal re-renders, memoized lists
* Lightweight JSON content pipeline

---

## 🧪 Quality

* TypeScript for safety
* Recommended: enable ESLint + Prettier in your editor
* Conventional Commits for clean history

---

## 🛠️ Troubleshooting

* **Map not showing**: check `VITE_GOOGLE_MAPS_API_KEY`, billing status, and referer/domain restrictions.
* **No animation**: device stat animation respects reduced-motion; verify OS/browser setting.
* **AI requests blocked**: ensure the Express server is running and CORS allows `http://localhost:5173`.

---

## 🙌 Contributing

Issues and PRs are welcome. Please:

* Keep UI consistent with the design tokens
* Favor accessible components and semantic HTML
* Include screenshots for UI changes

---

## 📝 License

MIT — see [`LICENSE`](./LICENSE).
