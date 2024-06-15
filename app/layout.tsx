import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from '@clerk/themes';


const inter = Inter({ subsets: ["latin"] });

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
    <ClerkProvider
      appearance={{
        baseTheme: [dark, neobrutalism]
      }}
    >
      <html lang="en">
        <body className={`${inter.className}`}>
            {children}
        </body>
      </html>
    </ClerkProvider>
  );
}