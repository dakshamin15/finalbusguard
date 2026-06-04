import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "BusGuard — Real-Time Stop-Arm Violation Detection",
  description:
    "BusGuard detects illegal stop-arm violations in real time and triggers instant audio warnings — keeping students safe before harm occurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          background: "#ffffff",
          color: "#111111",
        }}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
