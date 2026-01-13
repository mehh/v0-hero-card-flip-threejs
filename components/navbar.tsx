"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-foreground font-mono text-lg">{"<"}</span>
          <span className="text-foreground font-semibold text-lg tracking-tight">Kris Chase</span>
          <span className="text-foreground font-mono text-lg">{"/>"}</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#work" className="text-foreground/60 hover:text-foreground transition-colors text-sm font-medium">
            Work
          </Link>
          <Link
            href="#about"
            className="text-foreground/60 hover:text-foreground transition-colors text-sm font-medium"
          >
            About
          </Link>
          <Link href="#blog" className="text-foreground/60 hover:text-foreground transition-colors text-sm font-medium">
            Blog
          </Link>
          <Link
            href="#contact"
            className="text-foreground/60 hover:text-foreground transition-colors text-sm font-medium"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button className="bg-foreground text-background hover:bg-foreground/90 font-medium">Let&apos;s Talk</Button>
        </div>
      </div>
    </nav>
  )
}
