"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-medium transition-colors hover:text-foreground ${
        isActive ? "text-primary font-semibold" : "text-muted"
      }`}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand logo & title */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">
            StudySpark
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden sm:flex items-center gap-6 sm:gap-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/generate">Generate</NavLink>
          <NavLink href="/study">Study</NavLink>
          <NavLink href="/health">Health</NavLink>
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="sm:hidden inline-flex items-center justify-center p-2 rounded-lg text-muted hover:text-foreground hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {isOpen && (
        <nav className="sm:hidden border-t border-border bg-card/95 backdrop-blur px-4 py-4 flex flex-col gap-3 shadow-lg">
          <NavLink href="/" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink href="/generate" onClick={closeMenu}>
            Generate
          </NavLink>
          <NavLink href="/study" onClick={closeMenu}>
            Study
          </NavLink>
          <NavLink href="/health" onClick={closeMenu}>
            Health
          </NavLink>
        </nav>
      )}
    </header>
  );
}
