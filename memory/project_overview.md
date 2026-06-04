---
name: project-overview
description: Full overview of the BusGuard Next.js marketing site — stack, pages, components, design system, and current state
metadata:
  type: project
---

BusGuard is a school bus stop-arm violation detection product built by three co-founders (Avyay Bharadwaj — Operations, Daksh — Marketing, Kshiteej — Technology). The marketing site is a Next.js 14 app deployed on Vercel, targeting school district transportation directors in Virginia.

**Why:** The site is the primary sales channel for getting district deployments. It must look credible, technical, and trustworthy.

**How to apply:** All design work should follow the established design system (dot-grid, orange #f97316, dark #111111, off-white #f2f2ef). Consistency with existing pages is critical.

## Stack
- Next.js 14, React 18, TypeScript, Tailwind CSS v3, Framer Motion v12, Three.js v0.184
- `.npmrc` has `legacy-peer-deps=true` (needed for Vercel — eslint-config-next@14 vs ESLint 9 conflict)

## Design System
- **Background (light):** `#f2f2ef` with `radial-gradient(circle, rgba(0,0,0,0.11) 1px, transparent 1px)` at `26px 26px` (dot-grid)
- **Background (dark):** `#111111` with subtle white grid lines
- **Accent:** `#f97316` (orange) for all highlights, CTAs, eyebrows
- **Text primary:** `#111111`; muted: `#555555`/`#666666`
- **Font class:** `font-black heading-tight` for headings; `clamp()` for responsive font sizes
- **Hero sections:** all use same dot-grid pattern + orange radial glow from top + orange eyebrow label + bold headline with orange span + subtitle text
- **Animations:** Framer Motion with `useInView`, `AnimatePresence`, `useScroll`/`useMotionValueEvent`

## Pages & Components

### `app/page.tsx` (Homepage)
Components in order: `BusGuardHero` (Three.js animation) → `Achievements` → `HowItWorks` → `SocialProof` → `Pricing`

### `components/BusGuardHero.jsx`
- Full 100vh Three.js canvas hero
- Dot-grid canvas background (`#f2f2ef` + dots)
- Assembly animation: 7 hardware components (PCB, accelerometer, edge processor, WiFi antenna, buzzers, varifocal camera, Pi camera) fly into a housing in pairs
- Housing: base (static) + 4 walls that start flat/horizontal and fold up (`easeOutBack`) after assembly
- Phases: assembling → closing → holding → exploding → revealing → reset
- Overlay text: "BusGuard" + "Intelligent Bus Safety System" during assembly; "BUSGUARD" + "School Bus Safety, Reimagined" during reveal
- Camera: perspective, position `[5.2, 3.4, 7.8]`, varifocal camera final pos `[0.50, 0.04, 0.31]`
- Scroll lock: if user scrolls away and returns, locks to reveal state with all meshes transparent

### `components/Navbar.tsx`
- Fixed, glassmorphic on scroll, logo: `/logo.png` (38×38)
- Nav links: Home / Technology / Impact / About / Contact
- CTA buttons: "Contact Sales" (outline) + "Get a Demo" (orange fill) → both go to `/contact`
- Hamburger menu for mobile

### `components/Footer.tsx`
- Dark `#111111` background
- Logo: `/image.png` (80×80 with `-16px` marginRight to compensate padding)
- 4-column grid: brand blurb / Navigation links / Contact details / "Built for safety" tagline
- Contact: `info@busguard.net`, Henrico County, VA

### `app/technology/page.tsx`
- Hero: dot-grid + 4 stat chips (95.3%, <200ms, IP67, 100dB)
- Sticky scroll timeline (`300vh` outer): 3 steps (Detection → Analysis → Alert), `AnimatePresence mode="wait"`, step number flashes orange, orange progress bar
- Features section: Computer Vision + Incident Logging with dark Terminal cards (blinking cursor)
- Spec table: 10 rows, highlighted rows for True Positive Rate and Alert Latency

### `app/impact/page.tsx`
- Hero: dot-grid + 4 stat chips (211, 95.3%, <2%, <200ms)
- Dark stats grid: 4 large numbers in `2×4` grid on `#111111`
- Timeline: vertical orange line, year-badge nodes, 5 milestones 2022–2025
- Ends with `<SocialProof />` component

### `app/about/page.tsx`
- Hero: dot-grid + bold headline "Why We Built BusGuard."
- Dark quote section on `#111111`
- Founders: 3 cards (Avyay, Daksh, Kshiteej) with photos from `/public/`, orange bottom bar + hover lift
- Values: 3 cards (Safety First, Evidence-Based, Partner-Driven)

### `app/contact/page.tsx`
- Hero: dot-grid
- Form section: 5-col grid (2 col info sidebar + 3 col form)
- Info sidebar: Email (info@busguard.net), Location (Henrico County, Virginia), Response Time
- Form: Name, Email, Organization, Role (select), Inquiry Type (pill toggles: demo/pricing/technical/partnership), Message
- Submits via `mailto:info@busguard.net`
- Light mode form inputs (`#f8f8f5` background)

## Key Numbers (used consistently across all pages)
- 211 controlled trials
- 95.3% true positive rate
- <2% false positive rate
- <200ms alert latency
- 100dB onboard buzzer
- IP67 weatherproof
- 256GB onboard storage
- info@busguard.net

## Public Assets
- `/logo.png` — used in Navbar
- `/image.png` — used in Footer (has built-in padding, hence negative margin)
- `/avyay.png`, `/daksh.png`, `/kshiteej.png` — founder photos
