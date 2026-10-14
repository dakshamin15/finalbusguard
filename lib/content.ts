// Single source of truth for every fact and line of copy on the site.
// Facts are carried over verbatim from www.busguard.net (see CONTENT_AUDIT.md).
// Do not add statistics, customers, partners, quotes, or awards that are not sourced here.

export const site = {
  name: "BusGuard",
  url: "https://www.busguard.net",
  email: "info@busguard.net",
  location: "Henrico County, Virginia",
  locationShort: "Henrico County, VA",
  description:
    "BusGuard detects illegal stop-arm violations in real time and triggers instant audio warnings, keeping students safe before harm occurs.",
  footerLine:
    "Real-time stop-arm violation detection, in active discussions with Virginia school districts.",
  tagline: ["Built for safety.", "Proven in the field."],
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "645f2ac3-b12d-41bc-b131-b89abec10c4e",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/problem", label: "Problem" },
  { href: "/technology", label: "Technology" },
  { href: "/recognition", label: "Recognition" },
  { href: "/about", label: "About" },
] as const;

export const hero = {
  eyebrow: "Intelligent bus safety system",
  title: "School bus safety, reimagined.",
  lede: "A safety device built for every school bus.",
  body: "BusGuard is a compact, weatherproof device that mounts inside any school bus and autonomously monitors for stop-arm violations, detecting, alerting, and logging every incident with no human intervention required.",
};

// Hardware callouts used by the hero assembly. Each line is a live spec.
export const callouts = {
  housing: { title: "Enclosure", spec: "IP67 weatherproof" },
  pcb: { title: "Onboard compute", spec: "256 GB storage" },
  edgeProc: { title: "Edge processor", spec: "On-device CNN" },
  wifi: { title: "Antenna", spec: "4G LTE + WiFi" },
  buzzers: { title: "Buzzers", spec: "100 dB" },
  varifocal: { title: "Camera", spec: "1080p wide-angle" },
} as const;

export const specLine = ["IP67 weatherproof", "4G LTE + WiFi", "12V bus power", "1080p wide-angle camera"];

export const featureStats = [
  {
    value: "95.3%",
    label: "True positive rate",
    title: "Real-Time Detection",
    body: "A custom-trained computer vision model watches the stop arm and surrounding traffic on every trip, day, night, rain, or shine.",
  },
  {
    value: "<200ms",
    label: "Start to buzzer fired",
    title: "Instant Alert",
    body: "The moment a violation is confirmed, a 100 dB onboard buzzer fires. No dispatcher. No delay. No human in the loop.",
  },
  {
    value: "256 GB",
    label: "Onboard storage",
    title: "Automatic Logging",
    body: "Every incident is automatically timestamped with GPS coordinates, image capture, and route ID, creating a legally defensible audit trail.",
  },
];

export const problem = {
  eyebrow: "The crisis",
  title: "A safety system that only watches.",
  intro:
    "According to the NASDPTS, millions of children are placed in the “Danger Zone” every year. While cameras record license plates for citations, no system currently intervenes to stop a tragedy before it happens.",
  stats: [
    {
      value: 43.5,
      decimals: 1,
      suffix: "M",
      label: "Annual violations",
      body: "Estimated illegal school bus passings in the 2022-2023 school year.",
      source: "NASDPTS National Stop-Arm Violation Survey, 2022–2023",
      sourceUrl: "https://stnonline.com/news/school-bus-illegal-passings-continue-increase-nationwide-nasdpts-survey-finds/",
    },
    {
      value: 17,
      decimals: 0,
      suffix: "M",
      label: "In the danger zone",
      body: "Occurrences where children were directly in the crossing zone during a violation.",
      // TODO(source): live site attributes this to NASDPTS without a specific report. Add the exact citation.
      source: "NASDPTS",
      sourceUrl: undefined,
    },
    {
      value: 95000,
      decimals: 0,
      suffix: "",
      label: "Daily incidents",
      body: "Vehicles illegally passing stopped buses every single school day.",
      // TODO(source): live site attributes this to NASDPTS without a specific report. Add the exact citation.
      source: "NASDPTS",
      sourceUrl: undefined,
    },
  ],
  failureTitle: "The “Documentation-Only” failure",
  failureBody:
    "Existing commercial systems are designed for post-hoc documentation. They capture license plates to process fines.",
  failureCallout: "By the time a violation is recorded, the child has already been exposed to the threat.",
  cards: [
    {
      title: "Reactive, not proactive",
      body: "Current market leaders focus on post-hoc documentation, mailing a ticket weeks after the child was already in danger.",
    },
    {
      title: "The critical window",
      body: "There is a critical 2-4 second window where a child decides to cross. Current systems offer zero intervention during this moment.",
    },
    {
      title: "Developmental vulnerability",
      body: "Children aged 5-8 have the least capacity to judge vehicle speed, making real-time alerts a necessity, not a luxury.",
    },
  ],
  closeTitle: "The status quo waits for the violation.",
  closeBody:
    "We believe the most valuable moment for intervention is during the violation event itself. That is why we built a prevention-first architecture.",
  closeCta: "See our proactive solution",
};

export type SceneStep = { tag: string; ms: string; title: string; body: string };

export const techSteps: SceneStep[] = [
  {
    tag: "Detection",
    ms: "0 ms",
    title: "Camera detects violation",
    body: "Computer vision continuously monitors the stop arm and surrounding traffic. The moment the arm extends and a vehicle crosses the threshold, analysis begins.",
  },
  {
    tag: "Analysis",
    ms: "~80 ms",
    title: "ML model validates threat",
    body: "The on-device CNN scores the frame, filtering parked cars, cyclists, and shadows. Only confirmed violations pass the 94% confidence threshold.",
  },
  {
    tag: "Alert",
    ms: "<200 ms",
    title: "Buzzer fires. Log written.",
    body: "An audible 100 dB alert fires through the onboard buzzers. Simultaneously, a timestamped record with GPS, image capture, and route ID is written to storage.",
  },
];

export const specs = {
  table: [
    { spec: "Detection model", value: "Custom CNN, proprietary dataset" },
    { spec: "True positive rate", value: "95.3% (211 trials)", hi: true },
    { spec: "False positive rate", value: "< 2%" },
    { spec: "Alert latency", value: "< 200 ms", hi: true },
    { spec: "Operating temp", value: "−20°C to 60°C" },
    { spec: "Enclosure", value: "IP67 weatherproof" },
    { spec: "Power", value: "12 V bus electrical" },
    { spec: "Storage", value: "256 GB onboard (expandable)" },
    { spec: "Connectivity", value: "4G LTE + WiFi sync" },
    { spec: "Camera", value: "1080p wide-angle, WDR" },
  ],
};

export const proof = {
  trials: 211,
  tpr: 95.3,
  quote:
    "What stands out about BusGuard is its prevention-first approach, alerting students in real time when a vehicle-violated stop arm can save a child’s life, and the ability to track and map violations gives our district critical insight to make smarter, safer decisions about where to focus our efforts.",
  name: "Jim Ellis",
  role: "Director of Pupil Transportation",
  org: "Henrico County Public Schools",
};

export const expo = {
  // Verified at highways.dot.gov/usdotsafetyexpo
  name: "U.S. Department of Transportation Road Safety Innovation Expo",
  shortName: "USDOT Road Safety Innovation Expo",
  date: "September 18, 2026",
  dateShort: "Sep 2026",
  location: "U.S. DOT Headquarters, Washington, D.C.",
  caption: "BusGuard presenting at the U.S. Department of Transportation Road Safety Innovation Expo.",
  body: "BusGuard presented at the first U.S. Department of Transportation Road Safety Innovation Expo, a one-day showcase of life-saving transportation technology held at U.S. DOT Headquarters in Washington, D.C.",
  alt: "The three BusGuard founders standing on stage in front of the U.S. Department of Transportation Road Safety Innovation Expo backdrop.",
  image: "/images/usdot_expo.jpg",
  disclaimer:
    "Appearance at the Expo does not reflect a preference, approval, or endorsement by the U.S. Department of Transportation.",
  link: "https://highways.dot.gov/usdotsafetyexpo",
};

export type Award = {
  id: string;
  date: string;
  name: string;
  badge: string;
  description: string;
  logo?: { src: string; w: number; h: number; invert?: boolean };
  photos: { src: string; alt: string; w: number; h: number }[];
};

export const awards: Award[] = [
  {
    id: "henrico",
    date: "December 2025",
    name: "Henrico Innovation Challenge",
    badge: "2nd Place",
    description:
      "Earned 2nd place at Henrico County’s flagship student innovation competition, recognized for technical excellence and demonstrated real-world safety impact.",
    logo: { src: "/media/henrico/logo.jpeg", w: 225, h: 225 },
    photos: [
      { src: "/media/henrico/pitching.png", alt: "BusGuard founders pitching at the Henrico Innovation Challenge", w: 1179, h: 1041 },
      { src: "/media/henrico/trifold.png", alt: "The BusGuard trifold display board from the Henrico Innovation Challenge", w: 1034, h: 842 },
      { src: "/media/henrico/certificate.jpg", alt: "Henrico Innovation Challenge 2nd place certificate", w: 1421, h: 952 },
    ],
  },
  {
    id: "diamond",
    date: "February 2026",
    name: "Diamond Challenge",
    badge: "National Semifinalists",
    description:
      "Earned a national semifinalist placement at one of the country’s most competitive high school entrepreneurship competitions, hosted by Horn Entrepreneurship at the University of Delaware.",
    logo: { src: "/media/diamond/logo.png", w: 928, h: 307 },
    photos: [
      { src: "/media/diamond/avyay.jpg", alt: "Diamond Challenge certificate of achievement", w: 1179, h: 1507 },
      { src: "/media/diamond/kshiteej.png", alt: "Diamond Challenge certificate of achievement", w: 948, h: 1262 },
      { src: "/media/diamond/daksh.png", alt: "Diamond Challenge certificate of achievement", w: 948, h: 1262 },
    ],
  },
  {
    id: "blueocean",
    date: "April 2026",
    name: "Blue Ocean Student Entrepreneur Competition",
    badge: "Top 250 Globally",
    description:
      "Ranked among the top 250 pitches worldwide in a competition with participation from 23,000+ students in 173 countries, pitching BusGuard’s stop-arm detection system as a market-creating solution to a decades-old safety problem.",
    logo: { src: "/media/blueocean/logo.png", w: 800, h: 250 },
    photos: [
      { src: "/media/blueocean/avyay.png", alt: "Blue Ocean Competition Top 250 Finalist certificate", w: 3517, h: 2488 },
      { src: "/media/blueocean/kshiteej.png", alt: "Blue Ocean Competition Top 250 Finalist certificate", w: 3517, h: 2488 },
      { src: "/media/blueocean/daksh.png", alt: "Blue Ocean Competition Top 250 Finalist certificate", w: 3517, h: 2488 },
    ],
  },
  {
    id: "innospark",
    date: "April 2026",
    name: "INNOSpark Pitch Competition",
    badge: "Top 10 of 875 · Finalist",
    description:
      "Placed top 10 out of 875 global pitches, earning Finalist recognition for innovation and real-world impact on student transportation safety.",
    logo: { src: "/media/innospark/logo.avif", w: 500, h: 168 },
    photos: [
      { src: "/media/innospark/avyay.png", alt: "INNOSpark Top 10 certificate of honour", w: 3510, h: 2482 },
      { src: "/media/innospark/kshiteej.png", alt: "INNOSpark Top 10 certificate of honour", w: 3510, h: 2482 },
      { src: "/media/innospark/daksh.png", alt: "INNOSpark Top 10 certificate of honour", w: 3510, h: 2482 },
    ],
  },
  {
    id: "vcee",
    date: "May 2026",
    name: "VCEE Lean Pitch Competition",
    badge: "Top 6 in State",
    description:
      "Ranked top 6 in Virginia at the VCEE Lean Pitch Competition, making the case for district-wide deployment of BusGuard’s safety system.",
    logo: { src: "/media/vcee-logo.png", w: 319, h: 179 },
    photos: [],
  },
];

export const recognition = {
  eyebrow: "Recognition",
  title: "Recognized at every stage.",
  sub: "Five competitions. Major news coverage. A team building something that matters, and proving it everywhere we go.",
  journey: "From local vision to national recognition & news.",
};

export const press = {
  outlet: "WRIC ABC 8News",
  eyebrow: "As seen on 8News",
  date: "August 2026",
  title: "Young Entrepreneurs Making School Buses Safer",
  body: "WRIC 8News spotlighted the BusGuard team and our mission to eliminate stop-arm violations using real-time detection and early-warning alerts for student safety.",
  videoId: "hAD6l9vFUIk",
  watchUrl: "https://youtu.be/hAD6l9vFUIk?si=kjY-8yUUHX1UnVFY",
  articleUrl:
    "https://www.wric.com/news/local-news/henrico-county/young-entrepreneurs-make-school-buses-safer-new-technology/",
  thumb: { src: "/media/press/wric-8news.png", w: 2874, h: 1508, alt: "The three BusGuard founders interviewed on WRIC 8News under the headline Putting a Stop to Bus Passing" },
};

export const about = {
  eyebrow: "About",
  title: "Why we built BusGuard.",
  sub: "Every school day, students cross roads in front of buses while other vehicles illegally run stop arms. BusGuard exists to end that.",
  mission:
    "A child waiting for their school bus should never have to worry about whether the car behind them will stop. Technology can solve that.",
  missionBy: "The BusGuard Team",
  founders: [
    {
      name: "Daksh Amin",
      role: "Chief Executive Officer",
      short: "CEO",
      photo: "/daksh.png",
      bio: "Leads BusGuard’s overall strategy, partnerships, and growth. Directs the organization’s vision and long-term development.",
    },
    {
      name: "Kshiteej Herode",
      role: "Chief Technical Officer",
      short: "CTO",
      photo: "/kshiteej.png",
      bio: "Leads the computer vision model, hardware integration, and software architecture. The technical backbone of the BusGuard system.",
    },
    {
      name: "Avyay Bharadwaj",
      role: "Chief Operating Officer",
      short: "COO",
      photo: "/avyay.png",
      bio: "Leads hardware testing and design, day-to-day operations, and pitches. Also directs external communication.",
    },
  ],
};

export const contact = {
  eyebrow: "Contact",
  title: "Let’s talk safety.",
  sub: "Contact sales, ask about pricing, or discuss a district deployment. We respond within one business day.",
  response: "Within 1 business day",
  roles: ["Transportation Director", "Superintendent", "Safety Officer", "Other"],
  types: [
    { value: "sales", label: "Contact Sales" },
    { value: "pricing", label: "Pricing" },
    { value: "technical", label: "Technical" },
    { value: "partnership", label: "Partnership" },
  ],
};

export const technology = {
  eyebrow: "Technology",
  title: "Engineering student safety.",
  sub: "A deep look at the computer vision, hardware, and software systems that power BusGuard’s real-time detection capabilities.",
  quick: [
    { value: "95.3%", label: "True positive rate" },
    { value: "<200ms", label: "Alert latency" },
    { value: "IP67", label: "Weatherproof" },
    { value: "100 dB", label: "Onboard buzzer" },
  ],
  features: [
    {
      eyebrow: "Core intelligence",
      title: "Computer vision",
      body: "Our proprietary CNN is trained specifically on stop-arm violation scenarios, accounting for bus geometry, arm extension angles, vehicle trajectories, and lighting variation. 95.3% true positive rate across 211 field trials.",
      tags: ["95.3% accuracy", "Custom dataset", "Day & night", "Multi-angle"],
      terminal: {
        label: "Live detection feed",
        rows: [
          { k: "Stop arm", v: "EXTENDED", hot: true },
          { k: "Vehicle", v: "DETECTED", hot: true },
          { k: "Confidence", v: "98.2%", ok: true },
          { k: "Action", v: "ALERT TRIGGERED", hot: true },
        ],
      },
    },
    {
      eyebrow: "Audit trail",
      title: "Incident logging",
      body: "Every detected violation is timestamped and stored with full metadata, GPS coordinates, image capture, vehicle speed estimate, and route ID, creating a legally defensible audit trail for district reporting.",
      tags: ["GPS timestamps", "Image capture", "Fleet dashboard", "Export-ready"],
      terminal: {
        label: "Incident log",
        rows: [
          { k: "Today", v: "3 violations", hot: true },
          { k: "This week", v: "12 violations" },
          { k: "Last export", v: "2 h ago" },
          { k: "Storage", v: "256 GB onboard", ok: true },
        ],
      },
    },
  ],
};
