import type { Metadata } from "next";
import { Metal_Mania, Spectral } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";

const metalMania = Metal_Mania({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
      className={`${metalMania.variable} ${spectral.variable} h-full`}
      style={{
        ["--font-metal" as string]: "var(--font-display)",
      }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Metal+Mania&family=New+Rocker&family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-text)] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
