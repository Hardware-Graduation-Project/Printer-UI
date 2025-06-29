import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrinterProvider } from "./contexts/PrinterStatusContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartPrint",
  description: "Modern 3D printer control dashboard",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrinterProvider>{children}</PrinterProvider>
      </body>
    </html>
  );
}
