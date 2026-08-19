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
      <body className="min-h-full flex flex-col">
        <header className="py-4 px-8">
          <Link href="/" className="text-2xl font-bold text-orange-300 hover:opacity-80"> 
          Movie Matcher 🎬
          </Link> 
        </header>
        <main className="flex-1">{children}</main> 
      </body>
    </html>
  );
}
