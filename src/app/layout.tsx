import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Matcher",
  description: "Swipe and match on a movie to watch with friends, in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col">
        <header className="shrink-0 py-4 px-8">
          <Link href="/" className="text-3xl font-bold text-white hover:opacity-80 tracking-tight drop-shadow-[0_5px_5px_rgba(99,102,241,0.7)]"> 
          Movie<span className="text-cyan-500">Matcher</span>
          </Link> 
        </header>
        <main className="flex-1 min-h-0">{children}</main> 
      </body>
    </html>
  );
}
