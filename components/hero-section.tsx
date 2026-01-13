"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { useTheme } from "next-themes"
import gsap from "gsap"
import * as THREE from "three"
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
const TILE_SIZE = 1
const GAP = 0.05
const FLIP_BACK_DELAY = 2000

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

interface FlipTileProps {
  position: [number, number, number]
  imageUrl: string
  index: number
  isFlipped: boolean
  onHover: (index: number) => void
  onLeave: (index: number) => void
  isDark: boolean
}

function FlipTile({ position, imageUrl, index, isFlipped, onHover, onLeave, isDark }: FlipTileProps) {
  const groupRef = useRef<THREE.Group>(null)
  const texture = useTexture(imageUrl)
  const isAnimatingRef = useRef(false)
  const currentRotationRef = useRef(0)

  // Apply grayscale effect to texture
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace
    }
  }, [texture])

  // GSAP flip animation
  useEffect(() => {
    if (!groupRef.current || isAnimatingRef.current) return

    const targetRotation = isFlipped ? Math.PI : 0

    if (Math.abs(currentRotationRef.current - targetRotation) < 0.01) return

    isAnimatingRef.current = true

    gsap.to(groupRef.current.rotation, {
      y: targetRotation,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimatingRef.current = false
        currentRotationRef.current = targetRotation
      },
    })
  }, [isFlipped])

  // Theme colors
  const backColor = isDark ? "#141414" : "#f2f2f2"
  const borderColor = isDark ? "#2e2e2e" : "#d9d9d9"

  return (
    <group ref={groupRef} position={position}>
      {/* Back face (solid color) */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[TILE_SIZE - GAP, TILE_SIZE - GAP]} />
        <meshBasicMaterial color={backColor} />
      </mesh>

      {/* Border for back face */}
      <lineSegments position={[0, 0, -0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(TILE_SIZE - GAP, TILE_SIZE - GAP)]} />
        <lineBasicMaterial color={borderColor} />
      </lineSegments>

      {/* Front face (image) - rotated 180 degrees so it shows when flipped */}
      <mesh
        rotation={[0, Math.PI, 0]}
        position={[0, 0, 0.01]}
        onPointerEnter={(e) => {
          e.stopPropagation()
          onHover(index)
        }}
        onPointerLeave={(e) => {
          e.stopPropagation()
          onLeave(index)
        }}
      >
        <planeGeometry args={[TILE_SIZE - GAP, TILE_SIZE - GAP]} />
        <meshBasicMaterial map={texture} toneMapped={false}>
          <GrayscaleShader />
        </meshBasicMaterial>
      </mesh>

      {/* Invisible interaction plane on back */}
      <mesh
        position={[0, 0, -0.02]}
        onPointerEnter={(e) => {
          e.stopPropagation()
          onHover(index)
        }}
        onPointerLeave={(e) => {
          e.stopPropagation()
          onLeave(index)
        }}
      >
        <planeGeometry args={[TILE_SIZE - GAP, TILE_SIZE - GAP]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

// Custom grayscale shader material
function GrayscaleShader() {
  return (
    <shaderMaterial
      attach="material"
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform sampler2D map;
        varying vec2 vUv;
        void main() {
          vec4 texColor = texture2D(map, vUv);
          float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          gl_FragColor = vec4(vec3(gray), texColor.a);
        }
      `}
      uniforms={{
        map: { value: null },
      }}
    />
  )
}

interface TileGridProps {
  tiles: string[]
  flippedTiles: Set<number>
  onTileHover: (index: number) => void
  onTileLeave: (index: number) => void
  isDark: boolean
}

function TileGrid({ tiles, flippedTiles, onTileHover, onTileLeave, isDark }: TileGridProps) {
  const { viewport } = useThree()

  // Calculate scale to fit grid in viewport
  const gridWidth = COLS * TILE_SIZE
  const gridHeight = ROWS * TILE_SIZE
  const scaleX = viewport.width / gridWidth
  const scaleY = viewport.height / gridHeight
  const scale = Math.min(scaleX, scaleY) * 0.95

  return (
    <group scale={scale}>
      {tiles.map((imageUrl, index) => {
        const col = index % COLS
        const row = Math.floor(index / COLS)

        const x = (col - COLS / 2 + 0.5) * TILE_SIZE
        const y = (ROWS / 2 - row - 0.5) * TILE_SIZE

        return (
          <FlipTile
            key={index}
            position={[x, y, 0]}
            imageUrl={imageUrl}
            index={index}
            isFlipped={flippedTiles.has(index)}
            onHover={onTileHover}
            onLeave={onTileLeave}
            isDark={isDark}
          />
        )
      })}
    </group>
  )
}

function Scene({ tiles, flippedTiles, onTileHover, onTileLeave, isDark }: TileGridProps) {
  const bgColor = isDark ? "#000000" : "#ffffff"

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <TileGrid
        tiles={tiles}
        flippedTiles={flippedTiles}
        onTileHover={onTileHover}
        onTileLeave={onTileLeave}
        isDark={isDark}
      />
    </>
  )
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [flippedTiles, setFlippedTiles] = useState<Set<number>>(new Set())
  const [tiles, setTiles] = useState<string[]>([])
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const flipBackTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map())
  const scrollRevealQueueRef = useRef<number[]>([])
  const revealIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hoverRevealedRef = useRef<Set<number>>(new Set())

  const isDark = !mounted || resolvedTheme !== "light"

  useEffect(() => {
    setMounted(true)
    setTiles(shuffleWithNoAdjacent(testimonialImages, COLS, ROWS))
  }, [])

  const scheduleFlipBack = useCallback((index: number, delay: number = FLIP_BACK_DELAY) => {
    const existingTimeout = flipBackTimeoutsRef.current.get(index)
    if (existingTimeout) clearTimeout(existingTimeout)

    const timeout = setTimeout(() => {
      setFlippedTiles((prev) => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
      flipBackTimeoutsRef.current.delete(index)
      hoverRevealedRef.current.delete(index)
    }, delay)

    flipBackTimeoutsRef.current.set(index, timeout)
  }, [])

  // Process scroll reveal queue
  useEffect(() => {
    revealIntervalRef.current = setInterval(() => {
      if (scrollRevealQueueRef.current.length > 0) {
        const nextTile = scrollRevealQueueRef.current.shift()!
        setFlippedTiles((prev) => new Set([...prev, nextTile]))
        scheduleFlipBack(nextTile)
      }
    }, 100)

    return () => {
      if (revealIntervalRef.current) clearInterval(revealIntervalRef.current)
      flipBackTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [scheduleFlipBack])

  // Scroll handler
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const viewportHeight = window.innerHeight
          const scrollProgress = Math.min(scrollY / viewportHeight, 1)

          for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
              const index = row * COLS + col
              const tileThreshold = (row + col) / (ROWS + COLS - 2)

              if (
                scrollProgress >= tileThreshold &&
                !flippedTiles.has(index) &&
                !scrollRevealQueueRef.current.includes(index)
              ) {
                if (scrollRevealQueueRef.current.length < 4) {
                  scrollRevealQueueRef.current.push(index)
                }
              }
            }
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [flippedTiles])

  const handleTileHover = useCallback((index: number) => {
    // Clear existing flip-back timeout
    const existingTimeout = flipBackTimeoutsRef.current.get(index)
    if (existingTimeout) clearTimeout(existingTimeout)

    // Mark as hover-revealed and flip it
    hoverRevealedRef.current.add(index)
    setFlippedTiles((prev) => new Set([...prev, index]))
  }, [])

  const handleTileLeave = useCallback(
    (index: number) => {
      // Only schedule flip-back if it was hover-revealed (not scroll-revealed)
      if (hoverRevealedRef.current.has(index)) {
        scheduleFlipBack(index, 600) // Quick flip-back creates the trail effect
      }
    },
    [scheduleFlipBack],
  )

  if (!mounted || tiles.length === 0) {
    return (
      <div className="relative min-h-[200vh] bg-black">
        <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-mono text-lg">{"<"}</span>
              <span className="text-white font-semibold text-lg tracking-tight">Kris Chase</span>
              <span className="text-white font-mono text-lg">{"/>"}</span>
            </div>
          </div>
        </div>
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="text-center max-w-4xl mx-auto px-6">
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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative min-h-[200vh] bg-background">
      <Navbar />

      <div className="fixed inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
          <Scene
            tiles={tiles}
            flippedTiles={flippedTiles}
            onTileHover={handleTileHover}
            onTileLeave={handleTileLeave}
            isDark={isDark}
          />
        </Canvas>
      </div>

      <HeroContent />
    </div>
  )
}
