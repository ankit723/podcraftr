import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from '@clerk/themes';
import AudioProvider from "@/providers/audioProvider";


const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PodCraftr",
  description: "Generate your podcasts and Stories using AI",
  icons:"/icons/logo.svg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{baseTheme: [dark, neobrutalism]}}>
      <html lang="en">
        <AudioProvider> 
          <body className={`${manrope.className}`}>
              {children}
          </body>
        </AudioProvider>
      </html>
    </ClerkProvider>
  );
}