# BusGuard v2: Design Plan

Branch: `redesign/site-v2` · Status: **built.**

> **Revision (2026-10-14):** after review, the dark theme was replaced with a warm light palette: cream paper `#F3EEE6`, white surfaces, ink `#18130F`, and the logo orange tuned to `#DC6420` (with `#A3450F` for small orange text, to pass contrast). The closing CTA is a full orange band. Everything else in this plan (type, motion, architecture) shipped as written. A visitor-facing **Motion on/off** toggle was added in the footer, because the OS "reduce motion" setting otherwise hides all choreography.
Content source: `CONTENT_AUDIT.md`. Every fact on the site comes from there.

---

## 0. The idea

**Two hundred milliseconds, slowed down.**

BusGuard's whole product happens in less than a blink: a car runs the stop arm, the camera sees it, a buzzer fires. The site stretches that one event across the scroll. As you move down the home page you're scrubbing through a single detection event, from the arm extending to the alert to the record being written. Everything visual comes from that moment:

- **Detection brackets.** The four orange corner marks of a computer vision bounding box are the one recurring motif. They frame images, lock onto cards on hover, mark keyboard focus, and form the logo lockup in the OG image. When the brand needs emphasis, it draws a detection box around it.
- **The millisecond rail.** A thin mono readout in the nav (`T+000 ms`) advances as you scroll and reaches `T+200 ms` at the closing CTA. It's decorative and hidden from screen readers. It turns the scroll position into the story.
- **Orange means signal.** #FF6B00 appears only where the system would act: the alert, the detection box, the primary CTA, live state. Everything else is grayscale. If orange is on screen, something is happening.

What I'm taking from each reference, and what I'm leaving behind:
- **Apple:** hardware assembly pinned to scroll, with callouts arriving as each part locks in. *Not* the white product void; ours sits in a dark studio.
- **Linear:** typographic restraint, hairline borders, soft glow behind key elements. *Not* purple gradient meshes.
- **Stripe:** depth in the small things, like springy hovers, cursor-tracked light on cards, and careful focus states.
- **Vercel:** visible grid discipline. Faint column lines show in a few sections so the alignment reads as intentional.
- **Lusion and Igloo:** one immersive WebGL moment (the hero), not WebGL everywhere. The signature scene is SVG and DOM layers, so it's crisp and cheap.

---

## 1. Visual system

### Color tokens (CSS variables in `globals.css`, mirrored in `tailwind.config`)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#08080A` | page |
| `--surface-1` | `#0E0E11` | sections, alt bands |
| `--surface-2` | `#141418` | cards |
| `--surface-3` | `#1C1C21` | hover, inputs |
| `--line` | `rgba(255,255,255,0.08)` | hairlines, grid lines |
| `--line-strong` | `rgba(255,255,255,0.14)` | card borders on hover |
| `--fg` | `#F4F4F5` | headings and body |
| `--fg-muted` | `#A1A1AA` | secondary text (7.8:1 on bg) |
| `--fg-subtle` | `#7E7E87` | captions and meta (5.0:1 on bg, passes AA) |
| `--accent` | `#FF6B00` | signal only (7.0:1 on bg) |
| `--accent-glow` | `rgba(255,107,0,0.32)` | radial glows and pulse rings |

**Accessibility call:** white text on #FF6B00 is 2.9:1, which fails WCAG AA and would cost the Lighthouse 100. Primary buttons use **near-black text (#0A0A0A) on orange**, which is 6.9:1. It also reads more industrial and distinctive than the usual white-on-orange.

**Texture:** a fixed film-grain layer (a 128px tiled noise PNG of about 6 KB, at 4% opacity with `mix-blend-mode: overlay`). It sits on one fixed compositor layer and only moves under a stepped `transform` jitter at 8 fps (cheap). It's off under reduced motion. Orange glows are blurred radial gradients baked into static layers. They're never animated with `filter`.

### Typography (all through `next/font/google`, self-hosted, `display: swap`, latin subset)
| Role | Face | Why |
|---|---|---|
| Display | **Archivo** (variable, `wght` 100–900, `wdth` 62–125) | A sharp, slightly industrial grotesque. The width axis lets one file do both tight, heavy headlines and *condensed* giant stat numerals, which fill the viewport without wrapping. |
| Body | **Inter** (variable) | As specified |
| Telemetry | **JetBrains Mono** (400 and 500 only) | HUD readouts, eyebrows, the ms rail, spec values. Not preloaded. |
| Editorial | **Instrument Serif** *italic* (one style, about 20 KB) | Used only for the Jim Ellis quote and the founders' mission quote. A sharp contrast that makes the testimonial feel set by hand. |

Preload only Archivo and Inter. Total font weight is about 130 KB, and next/font's metric-matched fallbacks keep font CLS near zero.
*Alternative:* swap Archivo for **Overpass**, an open-source face derived from the FHWA highway-sign alphabet. That's a nice road-safety story, but it's softer at heavy weights. I recommend Archivo.

### Type scale (fluid, `clamp()` from 390px to 1440px)
| Token | Size | Line height / tracking | Face |
|---|---|---|---|
| `display-xl` | 56px → 152px | 0.88 / −0.045em | Archivo 800, wdth 100 |
| `display-l` | 44px → 104px | 0.92 / −0.04em | Archivo 750 |
| `display-m` | 32px → 64px | 1.0 / −0.035em | Archivo 700 |
| `stat-xxl` | 96px → 320px | 0.8 / −0.05em | Archivo 800, **wdth 70**, tabular |
| `stat-l` | 56px → 112px | 0.9 / −0.04em | Archivo 800, wdth 85, tabular |
| `title` | 20px → 28px | 1.2 / −0.02em | Archivo 650 |
| `quote` | 30px → 64px | 1.12 / −0.01em | Instrument Serif italic |
| `body-l` | 18px → 21px | 1.55 | Inter 400 |
| `body` | 16px | 1.6 | Inter 400 |
| `small` | 14px | 1.5 | Inter 450 |
| `eyebrow` | 12px | 1.0 / +0.14em uppercase | JetBrains Mono 500 |

### Grid and spacing
- 12 columns at ≥1024px (24px gutters, 40px margins, 1360px max), 8 columns at 768px (20/24), 4 columns at 390px (16/16).
- 4px base spacing. Section rhythm is 160 / 120 / 88px vertical (desktop / tablet / mobile).
- `<GridLines />` draws the column hairlines in the hero, specs, and closing CTA, so the alignment is visible.

### Iconography
Custom 24px icons with a 1.5px stroke in one consistent family (camera, buzzer, signal, drop/shield, plug, storage, thermometer, target). Each has a small idle animation that uses only transform and opacity: buzzer arcs scale and fade, signal bars step their opacity, the aperture rotates.

---

## 2. Motion system

### Tokens (`lib/motion.ts`, single source; exported to CSS vars, Motion, and GSAP via `CustomEase` so the curves match exactly)
| Token | Value | Use |
|---|---|---|
| `ease.out` | `cubic-bezier(0.16, 1, 0.3, 1)` | reveals, entrances |
| `ease.inOut` | `cubic-bezier(0.65, 0, 0.35, 1)` | scrubbed scenes, page curtain |
| `ease.snap` | `cubic-bezier(0.2, 0, 0, 1)` | UI state changes, hovers |
| `spring.magnetic` | stiffness 220, damping 18, mass 0.4 | magnetic CTA, card tilt |
| `dur.instant / fast / base / slow / reveal` | 120 / 220 / 420 / 720 / 1100 ms | |
| `stagger.word / line / card` | 60 / 90 / 80 ms | |

### Libraries and their jobs
- **Lenis** handles smooth scroll (`lerp 0.1`, native feel, wheel only, so touch stays native). It's driven by `gsap.ticker` so Lenis and ScrollTrigger share one RAF. It's disabled under reduced motion. Anchor links and focus-scroll go through `lenis.scrollTo`.
- **GSAP + ScrollTrigger** handle *only* the scrubbed scenes (hero assembly, Problem, How it works, Proof bar, Expo parallax). Desktop and mobile get separate timelines through `ScrollTrigger.matchMedia`.
- **Motion** (`motion/react`, replacing `framer-motion`) handles component interactions: magnetic button, card tilt and spotlight, lightbox, mobile menu, page transitions, and in-view reveals. It uses `LazyMotion` + `domAnimation` to stay around 18 KB.

### Pinning strategy (key engineering decision)
Pinned scenes use **CSS `position: sticky` inside a tall track** (for example `height: 400svh`), and ScrollTrigger only reads progress (`scrub: true`, `pin: false`). That means:
- no pin-spacer injection after hydration, so **no layout shift**
- the browser does the pinning natively, so there's no jank with Lenis
- the track height is in the server-rendered CSS, so scroll length is known before JS loads

### Rules
- Animate `transform` and `opacity` only. The single exception is the Expo image's one-shot `clip-path: inset()` reveal (the brief asks for it). It runs once for 1.1s on one layer, then parallax switches to `translateY`.
- `will-change` goes on just before a scene is active and comes off after.
- Counters render the **final value in the server HTML** and as the accessible name, so screen readers and no-JS users get the real number. Only the visible digits animate.
- **Reduced motion:** Lenis off, grain off, pinned tracks collapse to normal height, every scene shows its *final composed frame* (designed as a still), counters show final values, and page transitions become a 150ms fade.
- **Mobile (<768px):** no pinning. Scenes become stacked "beats" that reveal on entry, with lighter choreography designed for a narrow screen rather than a shrunk desktop version.

### Page transition
`<TransitionLink>` handles every internal navigation:
1. A dark curtain wipes up (`translateY 100% → 0`, 420ms, `ease.inOut`). A 1px orange scanline rides its top edge, and the destination's name appears in mono.
2. `router.push()` runs and the new route mounts underneath.
3. The curtain continues off the top. The new page's headline does its masked word reveal.

Total is about 750ms. Focus moves to the new page's `<h1>`, and the route change is announced through a polite live region. Back/forward runs the reveal half only. Reduced motion uses a 150ms crossfade.

---

## 3. Information architecture

| Route | Status | Notes |
|---|---|---|
| `/` | redesigned | 9-part narrative below |
| `/problem` | **new** (live page missing locally) | |
| `/technology` | redesigned | reuses the signature scene with live 3-step copy |
| `/recognition` | **new**, replaces `/impact` | Expo photo leads; `/impact` gets a 308 redirect here |
| `/about` | redesigned | live bios; "Values" removed |
| `/contact` | redesigned | real Web3Forms submit |
| `not-found` | new | "No violation detected here." with brackets around nothing |

Global: skip link, sticky nav (transparent over the hero, then `--bg` at 72% with backdrop blur after 40px), mobile menu as a full-screen sheet with focus trap, footer that includes all six pages.

---

## 4. Home page, section by section

Track lengths are desktop (≥1024px). Tablet uses about 0.75× lengths. Mobile (<768px) isn't pinned.

### 4.1 Hero: "The unit assembles" (100svh + 150svh scrub)
**Load (0 to 1.2s):**
- Server-rendered: eyebrow `INTELLIGENT BUS SAFETY SYSTEM`, the H1 **"School bus safety, reimagined."**, a sub line from live ("A safety device built for every school bus."), and the **Contact Sales** CTA. The H1 is the LCP element and paints immediately in Archivo.
- Words reveal one by one: each word sits in an `overflow:hidden` mask and slides from `translateY(110%)` to `0`, 60ms stagger, 1100ms `ease.out`. CSS-only, so it runs before hydration.
- Behind it, an AVIF poster of the *exploded* unit (rendered from the 3D scene, about 40 KB) appears instantly. The R3F canvas loads after `requestIdleCallback` and crossfades over the poster once its first frame is ready.

**Scroll (scrubbed over 150svh, sticky):**
| Progress | What happens |
|---|---|
| 0–10% | Headline block drifts up and fades (`translateY −8vh`, opacity → 0). Parts hang in an exploded ring and slowly breathe. |
| 10–80% | Six parts fly in and lock, one beat each: enclosure, PCB, edge processor, camera, buzzer, antenna. Each lock-in gets a tiny camera dolly and a soft "click" scale (1.02 → 1). A leader line draws (via `scaleX`) to a mono callout using **only live facts**: `1080P WIDE-ANGLE CAMERA` · `100 DB ONBOARD BUZZER` · `4G LTE + WIFI` · `IP67 WEATHERPROOF` · `12V BUS POWER` · `256 GB ONBOARD STORAGE` |
| 80–100% | Camera orbits to a three-quarter hero angle. An orange rim light swells behind the unit (the only orange so far). Callouts settle into a clean two-column spec list. |

**3D build (R3F + drei):**
- The existing procedural geometry is ported to R3F components. There's **no model download**, which beats any Draco GLB on weight (see §7 note).
- Materials are `MeshPhysicalMaterial`: powder-coat black enclosure (roughness 0.62, light clearcoat), bead-blasted aluminum bezels (metalness 1, roughness 0.38), solder-mask PCB with gold pads, smoked lens glass with a strong env reflection (no `transmission`, which is too expensive).
- Lighting uses drei `<Environment>` built from `<Lightformer>`s (a procedural studio: large softbox key, strip rims, and an orange kicker that animates in at the end). No HDR file to download.
- Shadows: `<AccumulativeShadows>` bakes a soft contact shadow once for the assembled pose. During motion, a cheap `<ContactShadows frames={1}>` updates only on lock events.
- Performance: `dpr [1, 1.75]`, `<PerformanceMonitor>` drops DPR on slow GPUs, `frameloop="demand"`, invalidated only by scroll progress, and the canvas pauses when off-screen.

**Magnetic CTA:** the button follows the cursor within a 90px radius using `spring.magnetic` (translate only), and the label moves at 0.5× for parallax. On press it scales to 0.97. It's a real `<a href="/contact">`, so it works without JS.

**Mobile and reduced motion:** no WebGL. The assembled-unit AVIF poster shows with a light CSS `translateY` parallax, and the six callouts reveal as a staggered list beneath. WebGL loads only at ≥768px, when `prefers-reduced-motion` isn't set and `navigator.connection.saveData` is false. That's what keeps Lighthouse mobile at 90+.

### 4.2 The problem: "A safety system that only watches." (400svh)
- Opens with the live heading, set `display-l`, and the NASDPTS intro paragraph.
- Then **three full-viewport stat panels**, each taking the sticky frame in turn:
  - **43.5M** · Annual violations · "Estimated illegal school bus passings in the 2022-2023 school year."
  - **17M** · In the danger zone · "Occurrences where children were directly in the crossing zone during a violation."
  - **95,000** · Daily incidents · "Vehicles illegally passing stopped buses every single school day."
  - Under each: `SOURCE: NASDPTS` plus a visible `TODO(source)` until you give me the exact report and URL.
- **Choreography:** each numeral is `stat-xxl` condensed, nearly edge to edge. It counts up once, time-based (1.2s, `ease.out`), when its panel becomes active. A *scrubbed* count feels gimmicky and stutters when you scroll back. Between panels, the old number slides up and out through a mask while the next rises in. A thin progress tick (1/3, 2/3, 3/3) sits in the corner.
- The last beat pulls the three "Documentation-Only failure" points into a row of cards, and **"The status quo waits for the violation."** leads into How it works.
- **Mobile:** three stacked 80svh blocks, each counting on entry.

### 4.3 How it works: the signature scene (500svh)
A side-on, line-drawn street at night: road, lane dashes, the bus in profile drawn in white hairlines, and a stop arm. Each element is its **own HTML layer holding a small SVG**, so motion stays on the compositor. A millisecond rail runs along the bottom: `0 ─── ~80 ─── <200 ms`, with a playhead tied to scroll. Headline: **"Two hundred milliseconds, slowed down."**

| Beat | Progress | Visual | Copy (live) |
|---|---|---|---|
| Setup | 0–12% | Bus pulls in and stops; the stop arm swings out (rotate 0 → 90°). | "No human intervention. Under 200ms." |
| **01 Detect** · 0 ms | 12–40% | A car slides in from the right. Orange detection brackets fly in from 3× scale and **lock** around it with a snap (`ease.snap`). The mono tag reads `VEHICLE · STOP ARM EXTENDED`. The playhead sits at 0. | "Camera Detects Violation" + live body |
| *Analysis* · ~80 ms | 40–55% | A scanline sweeps the bracketed box. The playhead moves to ~80. | "ML Model Validates Threat" + live body (94% threshold) |
| **02 Alert** · <200 ms | 55–75% | Three concentric orange rings ripple out from the bus (scale 0.2 → 3, opacity 0.6 → 0, staggered) as the **100 dB** buzzer. A soft orange bloom washes the frame. The playhead hits 200, and the rail's final segment lights. | "Buzzer Fires." + live body |
| **03 Log** | 75–100% | The scene scales down into a card and **drops onto an abstract street-grid map** (drawn lines, no map tiles, no real location). A pin lands with a small bounce. An incident card unfolds with the four logged fields: `TIMESTAMP · GPS · IMAGE CAPTURE · ROUTE ID`. Values are clearly marked **Illustrative**. | "Log Written." + "Every incident is automatically timestamped with GPS coordinates, image capture, and route ID…" |

- The left-column step index (01 Detect, 02 Alert, 03 Log) highlights with progress and is also a real `<ol>` for screen readers.
- **Reduced motion:** one designed still with all beats annotated on a single frame.
- **Mobile:** three stacked cards, each with its own small auto-playing vignette that plays once on entry (brackets lock, rings pulse, pin drops).

### 4.4 Specs: bento grid
12-column bento at desktop:
```
[ 95.3% True positive rate · 211 trials  (6×2) ][ <200ms latency (3) ][ 100 dB buzzer (3) ]
                                               [ 256 GB storage (3) ][ IP67 (3)          ]
[ 1080p wide-angle, WDR (4) ][ 4G LTE + WiFi (4) ][ 12V bus power (4) ]
[ −20°C to 60°C operating (6) ][ < 2% false positive rate (6) ]
```
- Every value is from the live Technology spec table.
- **Hover depth:** ≤4° 3D tilt on a Motion spring. A cursor-tracked spotlight is a radial-gradient layer moved by `transform`, not by `background-position`. The border brightens through an opacity cross-fade on a pseudo-layer, and orange detection brackets snap into the card's corners. Keyboard focus gets the same brackets.
- Numbers count up once on entry. Icons run their idle loop only while hovered or in view.
- Tablet: 2 columns. Mobile: 1 column, with the 95.3% card first.

### 4.5 Proof: data moment and testimonial (200svh)
- **211** is drawn as a field of 211 small squares that light up in a fast diagonal wave as you scroll in (opacity only, one CSS custom property per square for delay). Caption: "211 trials."
- Below it, **95.3%** at `stat-xxl` with a full-width bar that fills with `scaleX(0 → 0.953)`, scrubbed. Caption: "True positive rate."
- *I won't show how many of the 211 succeeded. That breakdown isn't published, so I won't imply one.*
- Then the **Jim Ellis** quote, set in Instrument Serif italic at `quote` size across 10 of 12 columns. Lines reveal through masks (GSAP SplitText by line, 90ms stagger). The attribution is in mono: `JIM ELLIS · DIRECTOR OF PUPIL TRANSPORTATION, HENRICO COUNTY PUBLIC SCHOOLS`. A huge, faint orange quote mark sits behind it at 6% opacity.

### 4.6 USDOT Expo feature (full bleed, about 140svh)
- `public/images/usdot_expo.jpg` through `next/image` (AVIF and WebP, `sizes="100vw"`, blur placeholder).
- **Entry:** `clip-path: inset(18% 12% 18% 12% round 24px)` opens to `inset(0 round 0)` (1.1s, `ease.out`, runs once). The image counter-scales from 1.12 to 1.0 at the same time, so it feels like a lens opening.
- **Parallax:** the inner image moves `translateY(−6% → 6%)`, scrubbed, at gentle strength.
- **Caption** (bottom-left over a gradient scrim): eyebrow `PRESENTED AT`, then **"BusGuard presenting at the U.S. Department of Transportation Road Safety Innovation Expo."**, then a mono line `TODO: DATE · LOCATION`. The wording is "presented at" only, with no logos, no "partner", and no "endorsed".
- **Alt:** "The three BusGuard founders standing on stage in front of the U.S. Department of Transportation Road Safety Innovation Expo backdrop."
- **Crop:** desktop is 16:9 cover with `object-position: 48% 55%`, which keeps all three founders and the expo title. Mobile shows the native 4:3, because a tall crop would cut a founder out.

### 4.7 Recognition
- A decorative marquee strip runs each badge in mono (`2ND PLACE · HENRICO INNOVATION CHALLENGE ✦ NATIONAL SEMIFINALISTS · DIAMOND CHALLENGE ✦ …`). It's `aria-hidden`, pauses on hover and focus, has a visible pause button (WCAG 2.2.2), and stays static under reduced motion.
- Below it, the real content: **six cards** (five competitions plus the Expo) in a staggered reveal (80ms, rising 24px). Each card shows the logo, badge, date, and live description, and gets the hover brackets.
- Links to `/recognition` for photos and full detail.

### 4.8 Press: 8News
- A two-column layout. On the left, "As Seen On 8News", **"Young Entrepreneurs Making School Buses Safer"**, the live blurb, and both links (Watch broadcast, Read article).
- On the right, the `newspic2.png` thumbnail (AVIF) with a play button wrapped in detection brackets.
- Clicking opens a **lightbox** that mounts a `youtube-nocookie.com/embed/hAD6l9vFUIk?autoplay=1` iframe only on click. It traps focus, closes on Esc or backdrop click, returns focus to the trigger, has a titled iframe, and locks Lenis while open.

### 4.9 Closing CTA and footer
- The ms rail reads `T+200 ms`. A statement headline at `display-xl` reveals by word: **"Built for safety. Proven in the field."** (live tagline).
- A magnetic **Contact Sales** button and `info@busguard.net` as a large underlined link with an animated underline (`scaleX`).
- The footer has four columns: brand line (live), all six pages, contact (email, Henrico County, VA), and © 2026. Grid lines continue through it.

---

## 5. Other pages (same system)

**Problem.** Hero "A Safety System That Only Watches." with the masked reveal. Full NASDPTS intro. The same three stat panels (shared component). "The Documentation-Only Failure" as an editorial two-column layout with the callout in Instrument Serif. Three cards. Close: "The status quo waits for the violation." → **See Our Proactive Solution** (TransitionLink to /technology).

**Technology.** Hero "Engineering Student Safety." with the four quick stats in a hairline row. The **signature scene** (shared component) runs with the full live three-step copy (0 ms / ~80 ms / <200 ms). Then Computer Vision and Incident Logging as alternating feature blocks, each with an animated mono terminal panel (typed rows, blinking caret) labelled *Illustrative*. Then "Under the hood." as a full spec table: hairline rows, mono values, highlight on hover and focus, and orange on 95.3% and <200 ms as on live.

**Recognition.** Leads with the **USDOT Expo photo** as a full-bleed hero (same reveal), then "Recognized at Every Stage." and the live sub line. Then a vertical **timeline** (Dec 2025 to Aug 2026, plus the Expo with its TODO date). The spine draws via `scaleY` as you scroll. Each entry has its logo, badge, description, and a fanned photo stack that opens a lightbox gallery. Ends with the 8News feature and the Jim Ellis quote.

**About.** Hero "Why We Built BusGuard." The mission quote set large in Instrument Serif with "The BusGuard Team". Three founder portraits in a 3-up grid (grayscale at rest, color with brackets on hover), with live titles and bios. I'll order them **CEO, CTO, COO** (the live site leads with the COO); tell me if you'd rather keep the live order.

**Contact.** Hero "Let's Talk Safety." Split layout: details on the left (email, location, response time), form on the right. The real Web3Forms POST uses the live key, now in `NEXT_PUBLIC_WEB3FORMS_KEY`, plus a honeypot field. Inquiry chips are a proper `radiogroup`. Errors show inline (no `alert()`) and are announced through `aria-live`. Success state: "Message Sent!" with brackets locking around a checkmark.

---

## 6. Component architecture

```
app/
  layout.tsx            fonts, metadata, <SmoothScroll>, <Grain>, <Nav>, <PageTransition>, <Footer>
  page.tsx              home composition (server)
  problem/ technology/ recognition/ about/ contact/   page.tsx (server) + small client islands
  not-found.tsx  sitemap.ts  robots.ts  opengraph-image.tsx  icon.svg  apple-icon.png  manifest.ts
lib/
  motion.ts             easing, duration, and stagger tokens + CustomEase registration
  content.ts            ALL copy and facts from CONTENT_AUDIT.md (single source; TODOs live here)
components/
  system/   SmoothScroll, Grain, GridLines, Brackets, TransitionLink, MagneticButton,
            RevealWords, RevealLines, CountUp, MsRail, Lightbox, Marquee
  hero/     Hero (server shell + poster), HeroCanvas (dynamic, ssr:false), parts/*.tsx
  scenes/   ProblemStats, ViolationScene (shared by Home and Technology)
  sections/ SpecsBento, Proof, ExpoFeature, RecognitionStrip, Press, ClosingCta
```
Pages stay **server components**. Client code is limited to interactive islands, so most copy ships as plain HTML.

**Dependencies:** add `@react-three/fiber@8`, `@react-three/drei@9` (matching React 18), `gsap@3.13+` (ScrollTrigger, SplitText, and CustomEase are now free), `lenis@1`, `motion@12` (replacing `framer-motion`), and `sharp` (AVIF in `next start`). `three` stays at 0.184. I'll verify drei 9's compatibility when installing.

---

## 7. Engineering plan against the bar

| Target | How |
|---|---|
| Lighthouse mobile perf ≥ 90 | No WebGL on mobile. Copy is server-rendered. GSAP and Lenis load in one small client chunk. Motion uses LazyMotion. Images are AVIF with correct `sizes`. YouTube uses a click-to-load facade. Fonts: two preloaded, the rest swap. JS budget on mobile home is about 150 KB gz. |
| Accessibility 100 | Semantic landmarks, one `h1` per page, skip link, visible 2px orange `:focus-visible` outline with 3px offset plus brackets on cards, contrast tokens checked (see §1), labelled form fields, titled iframe, focus-trapped dialogs, `aria-hidden` on decorative scenes with a text equivalent alongside. |
| CLS < 0.05 | Sticky pins (no spacers), sized images, next/font fallbacks, and counters that render final width (tabular numerals, fixed `ch` width). |
| 3D | `dynamic(() => import(...), { ssr: false })`, poster first, idle-time load, desktop only. **Draco note:** the unit is procedural geometry, so there's no model file to compress, and that's lighter than any Draco GLB. If you later get a CAD export, I'll add a `gltf-transform` Draco and Meshopt pipeline. |
| Images | `next.config`: `images.formats: ['image/avif','image/webp']`. Every photo goes through `next/image`, and the expo image gets `priority` on /recognition only. |
| Metadata | `metadataBase` https://www.busguard.net, title template `%s · BusGuard`, per-page descriptions, a designed 1200×630 OG image (bracketed wordmark plus headline), Twitter card, favicon set (ico, svg, apple-touch, manifest icons) from the logo, sitemap, and robots. |
| Clean output | Zero console errors. `npm run build` and `npm run lint` must pass before I call any section done. |

**Next.js version:** the repo is on **Next 14.2.35 / React 18**. (AGENTS.md mentions a newer Next with a local docs folder, but `node_modules/next/dist/docs` doesn't exist in this install.) I'll stay on 14.2 + React 18 so the live deployment's runtime doesn't change, unless you want the upgrade to Next 15 / React 19 folded in.

---

## 8. Build order and verification

1. Foundations: tokens, fonts, grain, grid, Lenis + GSAP wiring, nav, footer, page transition, `content.ts`
2. Hero (R3F) and poster
3. Problem stats
4. Signature scene
5. Specs bento, Proof, Expo
6. Recognition strip, Press, Closing CTA
7. Problem, Technology, Recognition, About, Contact pages
8. Metadata, OG, icons, sitemap, 404
9. Final pass: Lighthouse (mobile and desktop), axe, reduced motion, keyboard-only walkthrough, build and lint

After each step I'll run the dev server and screenshot at **390, 768, and 1440px**, then write a short senior-designer critique (what's off, what I changed) before moving on.

---

## 9. What I need from you before I start

1. **Approve this plan** (or tell me what to change).
2. **Conflicts C1 to C8** in `CONTENT_AUDIT.md`: INNOSpark 850 vs 875, Blue Ocean "of 23,000+", VCEE "State Finalist" vs "Top 6", "controlled" vs "field" trials, the theme switch from light to dark, the accent change from #F97316 to #FF6B00, and the 4-second vs 2-4 second card.
3. **Permission to download the 21 live-site assets** (about 16.6 MB of PNG/JPG from busguard.net, listed in the audit) into `public/`. They'll ship as AVIF.
4. **Expo date and location**, and NASDPTS source details for the three stats. These can stay as visible TODOs if you don't have them yet.
