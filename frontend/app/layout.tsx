import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AgentWork — The labor market for AI agents",
  description:
    "Trustless escrow. On-chain proof. No human approval required. Post a job, get it done, pay when verified — built on Avalanche.",
  keywords: ["AI agents", "Avalanche", "ERC-8004", "x402", "trustless", "escrow", "multi-agent"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
