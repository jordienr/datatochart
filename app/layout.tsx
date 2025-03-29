import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Data to Chart",
  description:
    "Free, no sign up required and easy to use tool to create charts from any CSV or JSON data",
  authors: [{ name: "Jordi Enric", url: "https://jordienric.com" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <footer className="text-center text-sm text-muted-foreground py-12 mt-12 border-t border-zinc-200">
            Made by{" "}
            <Link className="underline" href="https://jordienric.com">
              Jordi Enric
            </Link>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import Link from "next/link";
