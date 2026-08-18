import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-muted transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}

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
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur">
          <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">
                StudySpark
              </span>
            </div>
            <nav className="flex items-center gap-8">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/generate">Generate</NavLink>
              <NavLink href="/study">Study</NavLink>
              <NavLink href="/health">Health</NavLink>
            </nav>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-12">
          {children}
        </main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-muted">
            &copy; 2026 StudySpark. Learn smarter, not harder.
          </div>
        </footer>
      </body>
    </html>
  );
}
