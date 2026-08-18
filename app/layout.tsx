import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudySpark - AI Flashcard Generator",
  description: "Generate and study flashcards with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-12">
          {children}
        </main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8 text-center text-sm text-muted">
            &copy; 2026 StudySpark. Learn smarter, not harder.
          </div>
        </footer>
      </body>
    </html>
  );
}

