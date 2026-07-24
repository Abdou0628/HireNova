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
  title: "HireNova - Générateur de CV & Lettres de Motivation",
  description: "Créez un CV professionnel optimisé ATS et une lettre de motivation en 60 secondes avec l'IA. Disponible en français, anglais, arabe et espagnol.",
  keywords: ["CV", "resume", "lettre de motivation", "générateur CV", "IA", "ATS", "multilingue", "HireNova", "français", "anglais", "arabe", "espagnol"],
  authors: [{ name: "E-Society 2050" }],
  icons: {
    icon: "/hirenova-logo.png",
  },
  openGraph: {
    title: "HireNova - Générateur de CV & Lettres de Motivation",
    description: "Créez un CV professionnel et une lettre de motivation en 60 secondes avec l'intelligence artificielle.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireNova",
    description: "Générateur de CV et lettres de motivation multilingue propulsé par l'IA",
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
