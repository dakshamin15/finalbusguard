import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/system/SmoothScroll";
import RevealObserver from "@/components/system/RevealObserver";
import { TransitionProvider } from "@/components/system/Transition";
import { MotionPrefs } from "@/components/system/MotionPrefs";
import { site } from "@/lib/content";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap", preload: false });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic"], variable: "--font-serif", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "BusGuard: Real-time school bus stop-arm violation detection",
    template: "%s · BusGuard",
  },
  description: site.description,
  applicationName: "BusGuard",
  keywords: ["school bus safety", "stop-arm violation", "stop arm camera", "student safety", "computer vision", "Henrico County"],
  openGraph: {
    type: "website",
    siteName: "BusGuard",
    url: site.url,
    title: "BusGuard: School bus safety, reimagined.",
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BusGuard: School bus safety, reimagined.",
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f3eee6",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Mark JS as available before first paint so reveal styles never flash visible-then-hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js');var ok=!matchMedia('(prefers-reduced-motion: reduce)').matches;try{var s=localStorage.getItem('bg-motion');if(s==='on')ok=true;if(s==='off')ok=false}catch(e){}if(ok)d.classList.add('motion-ok')})()",
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <MotionPrefs>
        <TransitionProvider>
          <Nav />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </TransitionProvider>
        </MotionPrefs>
        <SmoothScroll />
        <RevealObserver />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
