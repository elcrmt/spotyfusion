/**
 * SpotyFusion - Root Layout
 *
 * The root layout wraps all pages.
 */

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpotyFusion - Your Spotify Companion",
  description:
    "Discover your music stats, play blind tests, and generate mood-based playlists with SpotyFusion.",
  keywords: ["Spotify", "music", "stats", "playlist", "blind test"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 text-white antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
