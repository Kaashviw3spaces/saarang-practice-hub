import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saarang Practice Hub — Make Space for Music",
  description:
    "AI-powered music club management. Book practice sessions and coordinate rehearsals with ease.",
  keywords: ["music", "practice session", "booking", "rehearsal", "music club"],
  openGraph: {
    title: "Saarang Practice Hub",
    description:
      "Book practice sessions and coordinate rehearsals with ease.",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full`}
    >
      <body className="grain min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-text)] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
