import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import GlobalProviders from "@/components/support/global-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CV Genius IA - Générateur de CV Multilingue",
  description: "Créez un CV professionnel optimisé ATS en 60 secondes avec l'IA. Disponible en français, anglais et arabe.",
  keywords: ["CV", "resume", "générateur CV", "IA", "ATS", "multilingue", "français", "anglais", "arabe"],
  authors: [{ name: "Z.ai" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "CV Genius IA - Générateur de CV Multilingue",
    description: "Créez un CV professionnel en 60 secondes avec l'intelligence artificielle.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Genius IA",
    description: "Générateur de CV professionnel multilingue propulsé par l'IA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <GlobalProviders />
      </body>
    </html>
  );
}
