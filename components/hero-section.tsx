"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Navbar } from "./navbar"
import { HeroContent } from "./hero-content"

const testimonialImages = [
  "https://www.krischase.com/_next/image?url=/images/testimonials/gahl-peled.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/natalie-gashkova.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/rene-persau.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/anita-bala.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/misha-von-bennigsen.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/desmond-ademiluyi.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/abhishek-kolwalkar.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/yevhen-lohosha.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/amrutha-s.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/dale-fenton.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/christopher-evans.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/mitch-asham.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/jeu-wan-t-chatman.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/cara-schrock.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/robert-pounder.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/chris-weed.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/lena-stefani.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/georgios-psarakis.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/anastacia-escher.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/james-barros.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/eric-vaughan.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/dominic-dambrogia.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/corey-mangold.jpg&w=256&q=75",
  "https://www.krischase.com/_next/image?url=/images/testimonials/soren-iverson.jpg&w=256&q=75",
]

const COLS = 10
const ROWS = 8
const TOTAL_TILES = COLS * ROWS

const MAX_SCROLL_REVEALS = 6
const FLIP_BACK_DELAY = 2000 // 2 seconds before flipping back to black

function shuffleWithNoAdjacent(images: string[], cols: number, rows: number): string[] {
  const result: string[] = []
  const totalTiles = cols * rows

  for (let i = 0; i < totalTiles; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols

    const adjacent: string[] = []
    if (col > 0) adjacent.push(result[i - 1])
    if (row > 0) adjacent.push(result[i - cols])

    let attempts = 0
    let selectedImage: string
    do {
      selectedImage = images[Math.floor(Math.random() * images.length)]
      attempts++
    } while (adjacent.includes(selectedImage) && attempts < 50)

    result.push(selectedImage)
  }

  return result
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [flippedTiles, setFlippedTiles] = useState<Set<number>>(new Set())
  const [tiles, setTiles] = useState<string[]>([])

  const lastScrollRef = useRef(0)
  const scrollRevealQueueRef = useRef<number[]>([])
  const revealIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const flipBackTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map())
  const lastRevealedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    setTiles(shuffleWithNoAdjacent(testimonialImages, COLS, ROWS))
  }, [])

  const scheduleFlipBack = useCallback((index: number) => {
    const existingTimeout = flipBackTimeoutsRef.current.get(index)
    if (existingTimeout) clearTimeout(existingTimeout)

    const timeout = setTimeout(() => {
      setFlippedTiles((prev) => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
      lastRevealedRef.current.delete(index)
      flipBackTimeoutsRef.current.delete(index)
    }, FLIP_BACK_DELAY)

    flipBackTimeoutsRef.current.set(index, timeout)
  }, [])

  useEffect(() => {
    revealIntervalRef.current = setInterval(() => {
      if (scrollRevealQueueRef.current.length > 0) {
        const nextTile = scrollRevealQueueRef.current.shift()!
        setFlippedTiles((prev) => {
          const next = new Set(prev)
          next.add(nextTile)
          return next
        })
        scheduleFlipBack(nextTile)
      }
    }, 80)

    return () => {
      if (revealIntervalRef.current) {
        clearInterval(revealIntervalRef.current)
      }
      flipBackTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [scheduleFlipBack])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const viewportHeight = window.innerHeight
          const scrollProgress = Math.min(scrollY / viewportHeight, 1)

          const tilesToReveal: number[] = []

          for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
              const index = row * COLS + col
              const tileThreshold = (row + col) / (ROWS + COLS - 2)

              if (scrollProgress >= tileThreshold && !flippedTiles.has(index)) {
                tilesToReveal.push(index)
              }
            }
          }

          const newTilesToQueue = tilesToReveal
            .filter((t) => !scrollRevealQueueRef.current.includes(t))
            .slice(0, MAX_SCROLL_REVEALS)

          scrollRevealQueueRef.current.push(...newTilesToQueue)
          newTilesToQueue.forEach((t) => lastRevealedRef.current.add(t))

          lastScrollRef.current = scrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [flippedTiles])

  const handleTileHover = useCallback(
    (index: number) => {
      const col = index % COLS
      const row = Math.floor(index / COLS)

      const existingTimeout = flipBackTimeoutsRef.current.get(index)
      if (existingTimeout) clearTimeout(existingTimeout)

      setFlippedTiles((prev) => new Set([...prev, index]))
      scheduleFlipBack(index)

      const neighbors: { idx: number; delay: number }[] = []
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = row + dr
          const nc = col + dc
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            const neighborIdx = nr * COLS + nc
            const distance = Math.abs(dr) + Math.abs(dc)
            neighbors.push({ idx: neighborIdx, delay: distance * 50 })
          }
        }
      }

      neighbors.forEach(({ idx, delay }) => {
        setTimeout(() => {
          const existingNeighborTimeout = flipBackTimeoutsRef.current.get(idx)
          if (existingNeighborTimeout) clearTimeout(existingNeighborTimeout)

          setFlippedTiles((prev) => new Set([...prev, idx]))
          scheduleFlipBack(idx)
        }, delay)
      })
    },
    [scheduleFlipBack],
  )

  const handleTileLeave = useCallback((index: number) => {
    const existingTimeout = flipBackTimeoutsRef.current.get(index)
    if (existingTimeout) clearTimeout(existingTimeout)

    const timeout = setTimeout(() => {
      setFlippedTiles((prev) => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
      lastRevealedRef.current.delete(index)
      flipBackTimeoutsRef.current.delete(index)
    }, 800)

    flipBackTimeoutsRef.current.set(index, timeout)
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-[200vh] bg-black">
      <Navbar />

      <div className="fixed inset-0 overflow-hidden">
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {tiles.map((imageUrl, index) => {
            const isFlipped = flippedTiles.has(index)

            return (
              <div
                key={index}
                className="relative w-full h-full"
                style={{ perspective: "1000px" }}
                onMouseEnter={() => handleTileHover(index)}
                onMouseLeave={() => handleTileLeave(index)}
              >
                <div
                  className="relative w-full h-full transition-transform duration-500 ease-out cursor-pointer"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  <div
                    className="absolute inset-0 bg-neutral-900 border border-neutral-800"
                    style={{ backfaceVisibility: "hidden" }}
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt=""
                      className="w-full h-full object-cover grayscale"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <HeroContent />
    </div>
  )
}
