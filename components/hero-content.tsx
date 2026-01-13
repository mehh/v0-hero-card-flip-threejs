"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"

export function HeroContent() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="text-center max-w-4xl mx-auto px-6 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 bg-background/60 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 bg-foreground animate-pulse" />
          <span className="text-sm text-foreground/70">Available for new projects</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance">
          <span className="text-foreground">Building the</span>
          <br />
          <span className="text-foreground">Future</span>
        </h1>

        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Full-stack developer crafting immersive digital experiences with cutting-edge technology and pixel-perfect
          design.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium"
          >
            <a href="https://github.com/mehh/v0-hero-card-flip-threejs" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Get the Code
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-6 text-base font-medium bg-transparent"
          >
            <a href="https://v0-hero-card-flip-three-js.vercel.app" target="_blank" rel="noopener noreferrer">
              See Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
