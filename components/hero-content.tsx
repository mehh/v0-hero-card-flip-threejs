"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroContent() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="text-center max-w-4xl mx-auto px-6 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-black/60 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 bg-white animate-pulse" />
          <span className="text-sm text-white/70">Available for new projects</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance">
          <span className="text-white">Building the</span>
          <br />
          <span className="text-white">Future</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Full-stack developer crafting immersive digital experiences with cutting-edge technology and pixel-perfect
          design.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8 py-6 text-base font-medium">
            View My Work
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-base font-medium bg-transparent"
          >
            Get In Touch
          </Button>
        </div>
      </div>
    </div>
  )
}
