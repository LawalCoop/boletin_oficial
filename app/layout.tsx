import type { Metadata, Viewport } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "entreLín[IA]s - El Boletín Oficial en lenguaje ciudadano",
  description: "Traducimos el Boletín Oficial de Argentina a un lenguaje claro y accesible. Entendé qué dice el Estado sin ser abogado.",
  keywords: ["boletín oficial", "argentina", "noticias", "leyes", "decretos", "IA", "entrelinias"],
  metadataBase: new URL('https://entrelinias.vercel.app'),
  openGraph: {
    title: "entreLín[IA]s - El Boletín Oficial en lenguaje ciudadano",
    description: "Traducimos el Boletín Oficial de Argentina a un lenguaje claro y accesible.",
    url: 'https://entrelinias.vercel.app',
    siteName: 'entreLín[IA]s',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'entreLín[IA]s - El Boletín Oficial en lenguaje ciudadano',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "entreLín[IA]s - El Boletín Oficial en lenguaje ciudadano",
    description: "Traducimos el Boletín Oficial de Argentina a un lenguaje claro y accesible.",
    images: ['/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${lora.variable} ${inter.variable} antialiased bg-bg min-h-screen`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
