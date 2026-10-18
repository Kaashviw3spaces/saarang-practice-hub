import type { Metadata } from "next";
import { Anton, Bebas_Neue, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";

const anton = Anton({
  variable: "--font-poster",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const syne = Syne({
  variable: "--font-psychedelic",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${anton.variable} ${bebasNeue.variable} ${syne.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="grain min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-text)] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
