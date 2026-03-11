import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "incluPlan — Educação Inclusiva Potencializada por IA",
  description:
    "Plataforma de planejamento educacional inclusivo com geração de planos de aula personalizados por IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className={`${inter.variable} font-display antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
