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
  title: "BoletínAI - Noticias del Boletín Oficial simplificadas",
  description: "Portal de noticias que transforma el Boletín Oficial de Argentina en contenido accesible y ameno, generado con IA.",
  keywords: ["boletín oficial", "argentina", "noticias", "leyes", "decretos", "IA"],
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
