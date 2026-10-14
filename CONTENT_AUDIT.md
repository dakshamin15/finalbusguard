# BusGuard Content Audit

Live site (https://www.busguard.net) vs. this local repo. Captured 2026-10-13 from all six live pages: Home, Problem, Technology, Recognition, About, Contact. Steps and data that only appear after scrolling or interaction were read from the live page bundles.

**Rule for the redesign:** the live site is the source of truth. Every fact below is carried over word for word. Anything unconfirmed is marked `TODO` and never filled in with a guess.

---

## 1. Conflicts that need your answer

These are places where the brief, the live site, and the local code disagree. I won't publish any of these facts until you confirm them.

| # | Topic | Brief says | Live site says | Local code says |
|---|---|---|---|---|
| C1 | INNOSpark | "10th of 850" | "Top 10/875 · Finalist", "Placed top 10 out of 875 global pitches" | "Top 10 of 875 · April 2026" |
| C2 | Blue Ocean | "Top 250 of 23,000+" | "Top 250 Globally". The 23,000+ figure appears nowhere | "Top 250 · Global" |
| C3 | VCEE Lean Pitch | "Virginia Lean Pitch State Finalist" | "Top 6 in State", "Ranked top 6 in Virginia at the VCEE Lean Pitch Competition" | "Top 6 in Virginia" |
| C4 | Trial wording | "211 controlled trials" | Home: no trial count. Technology: "211 field trials" and "95.3% (211 trials)" | "211 controlled field trials", "211 real-world trials, not lab conditions" (contradicts itself) |
| C5 | USDOT Road Safety Innovation Expo | In the recognition list | **Not on the live site** | Not present |
| C6 | Theme | "dark background, white text" | **Light**: white and #F2F2EF backgrounds with #111 text. Only the testimonial band is dark | Light |
| C7 | Accent | #FF6B00 | #F97316 everywhere (Recognition page also uses #E87722) | #F97316 |
| C8 | Problem page | (n/a) | Card title "The 4-Second Gap", but its body says "a critical 2-4 second window" | Not present |

**What I'll do until you answer:** for C1 to C4, use the live wording ("Top 10/875", "Top 250 Globally", "Top 6 in State", "211 trials" with no qualifier). For C5, show the expo with a TODO for date and location. For C6 and C7, follow the brief: dark theme with #FF6B00. That's a deliberate change from the live site.

---

## 2. Live content inventory (source of truth)

### Global
- **Nav:** Home · Problem · Technology · Recognition · About · Contact Sales (button)
- **Footer:** "Real-time stop-arm violation detection , in active discussions with Virginia school districts." (The live site has a stray " , " where an em dash probably got replaced. I'll render it as a comma.) Navigation: Home, Technology, About, Contact (footer omits Problem and Recognition). Contact: info@busguard.net · Henrico County, VA · Contact Sales. Tagline: "Built for safety. Proven in the field." © 2026 BusGuard. All rights reserved.
- **Meta description:** "BusGuard detects illegal stop-arm violations in real time and triggers instant audio warnings, keeping students safe before harm occurs."
- **Title:** "BusGuard" on every page. Pages have no per-page titles, OG image, or Twitter card. Favicon is `/busguard.png` (1.4 MB PNG).

### Home `/`
- Hero (Three.js assembly): "BUSGUARD" · "INTELLIGENT BUS SAFETY SYSTEM" · "SCHOOL BUS SAFETY, REIMAGINED"
- Eyebrow "THE PRODUCT". Heading "A safety device built for every school bus."
- Body: "BusGuard is a compact, weatherproof device that mounts inside any school bus and autonomously monitors for stop-arm violations, detecting, alerting, and logging every incident with no human intervention required."
- Three feature stats:
  - **95.3%** TRUE POSITIVE RATE · Real-Time Detection: "A custom-trained computer vision model watches the stop arm and surrounding traffic on every trip, day, night, rain, or shine."
  - **<200ms** START TO BUZZER FIRED · Instant Alert: "The moment a violation is confirmed, a 100 dB onboard buzzer fires. No dispatcher. No delay. No human in the loop."
  - **256 GB** ONBOARD STORAGE · Automatic Logging: "Every incident is automatically timestamped with GPS coordinates, image capture, and route ID, creating a legally defensible audit trail."
- Spec line: "IP67 weatherproof · 4G LTE + WiFi · 12V bus power · 1080p wide-angle camera"
- Testimonial: "What stands out about BusGuard is its prevention-first approach, alerting students in real time when a vehicle-violated stop arm can save a child's life, and the ability to track and map violations gives our district critical insight to make smarter, safer decisions about where to focus our efforts." **Jim Ellis**, Director of Pupil Transportation, Henrico County Public Schools
- Press: "As Seen On 8News" · "Young Entrepreneurs Making School Buses Safer" · "WRIC 8News spotlighted the BusGuard team and our mission to eliminate stop-arm violations using real-time detection and early-warning alerts for student safety."
  - Watch News Broadcast → https://youtu.be/hAD6l9vFUIk?si=kjY-8yUUHX1UnVFY (embed: https://www.youtube.com/embed/hAD6l9vFUIk)
  - Read Article → https://www.wric.com/news/local-news/henrico-county/young-entrepreneurs-make-school-buses-safer-new-technology/

### Problem `/problem` (not in local repo)
- Eyebrow "THE CRISIS". Heading "A Safety System That Only Watches."
- Intro: "According to the NASDPTS, millions of children are placed in the "Danger Zone" every year. While cameras record license plates for citations, no system currently intervenes to stop a tragedy before it happens."
- Stats:
  - **43.5M** ANNUAL VIOLATIONS: "Estimated illegal school bus passings in the 2022-2023 school year."
  - **17M** IN THE DANGER ZONE: "Occurrences where children were directly in the crossing zone during a violation."
  - **95,000** DAILY INCIDENTS: "Vehicles illegally passing stopped buses every single school day."
  - `TODO(source)`: the live page credits only "the NASDPTS", with no report name, year, or link, and no per-stat source. The brief asks for each stat's source to be cited. I need the exact report title and URL for each number.
- Heading "The "Documentation-Only" Failure". Body: "Existing commercial systems are designed for post-hoc documentation. They capture license plates to process fines." Callout: "By the time a violation is recorded, the child has already been exposed to the threat."
- Cards:
  - REACTIVE, NOT PROACTIVE: "Current market leaders focus on post-hoc documentation—mailing a ticket weeks after the child was already in danger."
  - THE 4-SECOND GAP: "There is a critical 2-4 second window where a child decides to cross. Current systems offer zero intervention during this moment." (see C8)
  - DEVELOPMENTAL VULNERABILITY: "Children aged 5-8 have the least capacity to judge vehicle speed, making real-time alerts a necessity, not a luxury."
- Close: "The status quo waits for the violation." / "We believe the most valuable moment for intervention is during the violation event itself. That is why we built a prevention-first architecture." / "See Our Proactive Solution →" (/technology)

### Technology `/technology`
- Eyebrow "TECHNOLOGY". Heading "Engineering Student Safety." Sub: "A deep look at the computer vision, hardware, and software systems that power BusGuard's real-time detection capabilities."
- Quick stats: 95.3% True Positive Rate · <200ms Alert Latency · IP67 Weatherproof · 100 dB Onboard Buzzer
- Sequence "VIOLATION → ALERT", "No human intervention. Under 200ms.":
  1. **0 ms · DETECTION · Camera Detects Violation**: "Computer vision continuously monitors the stop arm and surrounding traffic. The moment the arm extends and a vehicle crosses the threshold, analysis begins." Readout: Stop Arm EXTENDED / Frame Index 00:00:000 / Trigger ACTIVE
  2. **~80 ms · ANALYSIS · ML Model Validates Threat**: "The on-device CNN scores the frame, filtering parked cars, cyclists, and shadows. Only confirmed violations pass the 94% confidence threshold." Readout: Model Custom CNN / Confidence 98.2% / False Pos. REJECTED
  3. **<200 ms · ALERT · Buzzer Fires. Log Written.**: "An audible 100 dB alert fires through the onboard buzzers. Simultaneously, a timestamped record with GPS, image capture, and route ID is written to storage." Readout: Buzzer 100 dB / GPS LOCKED / Log Entry WRITTEN
  - Note: the step 2 and 3 copy only renders on the live site after a scroll interaction, which didn't advance in my headless browser. I recovered it from the page bundle.
- Feature: CORE INTELLIGENCE · Computer Vision: "Our proprietary CNN is trained specifically on stop-arm violation scenarios, accounting for bus geometry, arm extension angles, vehicle trajectories, and lighting variation. 95.3% true positive rate across 211 field trials." Tags: 95.3% accuracy · Custom dataset · Day & night · Multi-angle. Mock "Live Detection Feed": Stop Arm EXTENDED / Vehicle DETECTED / Confidence 98.2% / Action ALERT TRIGGERED
- Feature: AUDIT TRAIL · Incident Logging: "Every detected violation is timestamped and stored with full metadata, GPS coordinates, image capture, vehicle speed estimate, and route ID, creating a legally defensible audit trail for district reporting." Tags: GPS timestamps · Image capture · Fleet dashboard · Export-ready. Mock "Incident Log": Today 3 violations / This Week 12 violations / Last Export 2 h ago / Storage 256 GB onboard
  - Note: the mock panels (98.2%, "3 violations") are illustrative UI, not measured results. The redesign will label them "Illustrative" so they don't read as data.
- Spec table "SPECIFICATIONS · Under the hood.": Detection Model: Custom CNN, proprietary dataset · True Positive Rate: 95.3% (211 trials) · False Positive Rate: < 2% · Alert Latency: < 200 ms · Operating Temp: −20°C to 60°C · Enclosure: IP67 weatherproof · Power: 12 V bus electrical · Storage: 256 GB onboard (expandable) · Connectivity: 4G LTE + WiFi sync · Camera: 1080p wide-angle, WDR

### Recognition `/recognition` (not in local repo; local has `/impact` instead)
- Eyebrow "IMPACT". Heading "Recognized at Every Stage." Sub: "Five competitions. Major news coverage. A team building something that matters, and proving it everywhere we go."
- "OUR JOURNEY · From local vision to national recognition & news."
- Timeline (live data):
  | Date | Name | Badge | Description | Assets |
  |---|---|---|---|---|
  | December 2025 | Henrico Innovation Challenge | 2nd Place | "Earned 2nd place at Henrico County's flagship student innovation competition, recognized for technical excellence and demonstrated real-world safety impact." | logo + 3 photos (pitching, trifold, certificate) |
  | February 2026 | Diamond Challenge (logo only) | National Semifinalists | "Earned a national semifinalist placement at one of the country's most competitive high school entrepreneurship competitions, hosted by Horn Entrepreneurship at the University of Delaware." | logo + 3 founder photos |
  | April 2026 | Blue Ocean Competition (logo only) | Top 250 Globally | "Ranked among the top 250 pitches worldwide, pitching BusGuard's stop-arm detection system as a market-creating solution to a decades-old safety problem." | logo + 3 founder photos |
  | April 2026 | INNOSpark Pitch Competition | Top 10/875 · Finalist | "Placed top 10 out of 875 global pitches, earning Finalist recognition for innovation and real-world impact on student transportation safety." | logo + 3 finalist cards |
  | May 2026 | VCEE Lean Pitch Competition | Top 6 in State | "Ranked top 6 in Virginia at the VCEE Lean Pitch Competition, making the case for district-wide deployment of BusGuard's safety system." | logo |
  | August 2026 | WRIC ABC 8News Feature | Featured on News | "Featured on WRIC ABC 8News highlighting how BusGuard's innovative stop-arm detection technology is taking active steps to make school buses safer in Henrico County." | thumbnail `newspic2.png`, YouTube embed, article link |
  | `TODO(date)` | U.S. DOT Road Safety Innovation Expo | Presented at | `TODO`: you supply the description. Caption from brief: "BusGuard presenting at the U.S. Department of Transportation Road Safety Innovation Expo." | `public/images/usdot_expo.jpg` (from `IMG_3392.JPG`) |
- Also repeats the Jim Ellis testimonial and the 8News block.

### About `/about`
- Eyebrow "ABOUT". Heading "Why We Built BusGuard." Sub: "Every school day, students cross roads in front of buses while other vehicles illegally run stop arms. BusGuard exists to end that."
- Quote: "A child waiting for their school bus should never have to worry about whether the car behind them will stop. Technology can solve that." (The BusGuard Team)
- "THE TEAM · The Founders." (live order):
  - **Avyay Bharadwaj**, Chief Operating Officer (COO): "Leads hardware testing and design, day-to-day operations, and pitches. Also directs external communication."
  - **Daksh Amin**, Chief Executive Officer (CEO): "Leads BusGuard's overall strategy, partnerships, and growth. Directs the organization's vision and long-term development."
  - **Kshiteej Herode**, Chief Technical Officer (CTO): "Leads the computer vision model, hardware integration, and software architecture. The technical backbone of the BusGuard system."

### Contact `/contact`
- Eyebrow "CONTACT". Heading "Let's Talk Safety." Sub: "Contact sales, ask about pricing, or discuss a district deployment. We respond within one business day."
- Details: Email info@busguard.net · Location Henrico County, Virginia · Response Time Within 1 business day
- Form "Send a Message": Full Name * (Jane Smith) · Email * (jane@district.edu) · Organization (County School District) · I am a... [Transportation Director / Superintendent / Safety Officer / Other] · Inquiry Type [Contact Sales / Pricing / Technical / Partnership] · Message ("Tell us about your district, fleet size, or specific questions...") · "Send Message →"
- Submission: POST to `https://api.web3forms.com/submit` with a public access key (already in the live bundle) and subject "BusGuard Inquiry , {type} , {organization || name}". Success: "Message Sent!" / "Thanks for reaching out. We'll get back to you within one business day." Failure: browser `alert()`.

---

## 3. Gaps: local code vs. live

### Wrong or outdated in local (must fix)
| Local | Live / correct |
|---|---|
| Email `busguardhelp@gmail.com` (Contact, Footer) | `info@busguard.net` |
| Founders "Daksh", "Kshiteej" (no surnames). Roles "Co-Founder — Operations / Marketing / Technology" with different bios | Daksh Amin (CEO), Kshiteej Herode (CTO), Avyay Bharadwaj (COO), with the live bios above |
| Testimonial is a different, unnamed quote ("BusGuard addresses a real gap...") | Jim Ellis quote, named and attributed |
| Nav: Home, Technology, Impact, About, Contact + "Get a Demo" | Home, Problem, Technology, Recognition, About + "Contact Sales" |
| Contact inquiry type "Request Demo"; heading "Get in Touch" | "Contact Sales"; "Let's Talk Safety." |
| Contact form fakes success and never sends | Web3Forms submission |
| VCEE card text "Top 6 in Virginia"; INNOSpark text "out of 875 competing teams... virtual finals" | Live descriptions above |

### In local but NOT on live (remove; nothing invented ships)
- **Pricing** section ($459 Standard, $409 District, warranties, "24/7 support", "No subscriptions", "Lifetime firmware updates") and the "$459 Per Unit" stat card. Not on live, so removed. `TODO`: tell me if pricing should come back.
- **`/impact` page timeline** (2022 founding "after a near-miss incident", 2023 prototype "90-day period", 2024 "v1.0 hardware", 2025 outreach). None of it is on live. Removed. `/impact` will redirect to `/recognition`.
- **About "Values" section** ("Safety First / Evidence-Based / Partner-Driven"). Not on live, and its "211 real-world trials, not lab conditions" contradicts "controlled". Removed.
- Contact "Status: In Active Discussions" card. The footer phrase "in active discussions with Virginia school districts" is live, so it stays there only.
- Hardware mock lines "Vibration-resistant", "Tamper-resistant", "Temperature 24°C", "vehicle speed estimate" in the hardware block. "Vehicle speed estimate" appears on live under Incident Logging and stays there. The others are dropped.

### On live but missing locally (must add)
- `/problem` page (entire)
- `/recognition` page (entire), including the timeline, photos, lightbox, and 8News embed
- Home: the product section copy, the three feature stats with their descriptions, the spec line, and the 8News block
- Technology: the ~80 ms analysis step, the 94% confidence threshold line, and "100 dB" in the quick stats
- Assets (live only, 16.6 MB total as PNG/JPG). The redesign serves them as AVIF through next/image.
  - `/Henrico Innovation Challenge/`: Pitching.png (1.9 MB), Trifold.png (1.3 MB), Certificate.jpg (168 KB), Logo.jpeg (5 KB)
  - `/Diamond/`: Avyay-Diamond.jpg (265 KB), Kshiteej-Diamond.png (1.5 MB), Daksh-Diamond.png (1.9 MB), Diamond-Challenge-Logo.png (8 KB)
  - `/Blue Ocean/`: Avyay / Kshiteej / Daksh (about 800 KB each), Blue-Ocean-Competition-Logo.png (60 KB)
  - `/InnoSpark/`: three finalist cards (about 590 KB each), InnoSpark-Logo.avif (8 KB)
  - `/VCEE Logo.png` (31 KB), `/newspic2.png` (3.9 MB, 8News thumbnail), `/image.png` (259 KB, footer logo), `/busguard.png` (1.4 MB, favicon), `/logo.png` (120 KB, which differs from the local 8.7 KB `logo.png`)

### New in this redesign (from brief, not on live)
- USDOT Road Safety Innovation Expo photo and caption. Wording is "presented at" only; no endorsement or partnership is implied. `TODO`: event date and location.
- Alt text: "The three BusGuard founders standing on stage in front of the U.S. Department of Transportation Road Safety Innovation Expo backdrop."
- Photo facts: 2048×1536 (4:3), 820 KB JPEG. The people stand at roughly 15%, 28%, and 70% of the frame width, so a tall mobile crop would cut someone out. Mobile keeps the native 4:3 framing (see DESIGN_PLAN.md).

---

## 4. Open TODOs (visible in the build until resolved)
1. C1 to C8 above
2. Expo: date, location, and a one-line description
3. Problem stats: exact NASDPTS report name, year, and URL for 43.5M, 17M, and 95,000
4. Permission to download the 21 live assets listed above into `public/`
5. Pricing: confirm it stays off the site
