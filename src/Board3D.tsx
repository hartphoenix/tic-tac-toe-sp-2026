import { useState, useEffect, useRef } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useSpring, animated } from "@react-spring/three"
import type { Player } from "./tic-tac-toe"
import type { PerspectiveCamera } from "three"
import type { Cell } from "./tic-tac-toe"

const BOX_SIZE = 0.9
const BASE_CAMERA_DISTANCE = 4.2
const MIN_SPREAD = 0.95  // 5% gap between boxes (nearly touching)
const MAX_SPREAD = 1.8   // 1 box-width gap between boxes
const DRAG_THRESHOLD = 5 // pixels of movement to count as drag

// Colors for cell states
const COLORS = {
  empty: "#d4af37",       // gold
  emptyHover: "#f5d676",  // lighter gold
  X: "#e63946",           // red
  O: "#457b9d",           // blue
}

type CellProps = {
  position: [number, number, number]
  value: Cell
  onClick: () => void
  claimedBy?: Player
}

// Individual cell in the 3D grid
function Cell3D({ position, value, onClick, claimedBy }: CellProps) {
  const [hovered, setHovered] = useState(false)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  // Determine color based on cell state
  const getColor = () => {
    if (value === "X") return COLORS.X
    if (value === "O") return COLORS.O
    return hovered ? COLORS.emptyHover : COLORS.empty
  }

  // Determine emissive (glow) color based on who claimed the row
  const getEmissive = () => {
    if (claimedBy === "X") return COLORS.X
    if (claimedBy === "O") return COLORS.O
    return "#000000"
  }

  // Animate color, opacity, and emissive changes over 300ms
  const springs = useSpring({
    color: getColor(),
    opacity: value ? 0.85 : hovered ? 0.6 : 0.2,
    emissiveIntensity: claimedBy ? 0.4 : 0,
    config: { duration: 300 }
  })

  const handlePointerDown = (e: { stopPropagation: () => void; clientX: number; clientY: number }) => {
    e.stopPropagation()
    pointerStart.current = { x: e.clientX, y: e.clientY }
  }

  const handleClick = (e: { stopPropagation: () => void; clientX: number; clientY: number }) => {
    e.stopPropagation()
    if (!pointerStart.current) return

    // Check if pointer moved beyond threshold (drag vs click)
    const dx = e.clientX - pointerStart.current.x
    const dy = e.clientY - pointerStart.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < DRAG_THRESHOLD) {
      onClick()
    }
    pointerStart.current = null
  }

  return (
    <group position={position}>
      <mesh
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
      >
        <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
        <animated.meshStandardMaterial
          color={springs.color}
          transparent
          opacity={springs.opacity}
          emissive={getEmissive()}
          emissiveIntensity={springs.emissiveIntensity}
        />
      </mesh>
    </group>
  )
}

// Adjusts camera FOV based on viewport aspect ratio (preserves OrbitControls rotation)
function CameraController() {
  const { camera, size } = useThree()

  useEffect(() => {
    const aspect = size.width / size.height
    // In portrait mode (aspect < 1), widen FOV to keep cube visible
    const cam = camera as PerspectiveCamera
    // eslint-disable-next-line react-hooks/immutability
    cam.fov = aspect < 1 ? 50 / aspect : 50
    cam.updateProjectionMatrix()
  }, [camera, size])

  return null
}

// Props interface - ready for game state integration
type Board3DProps = {
  board?: Cell[]
  onCellClick?: (index: number) => void
  rowsClaimed: Map<string, Player>
}

export function Board3D({ board, onCellClick, rowsClaimed }: Board3DProps) {
  // Default empty 27-cell board for demo
  const cells = board ?? Array(27).fill(null)

  // Build index→player lookup for claimed cells (for glow effect)
  const claimedByIndex = new Map<number, Player>()
  for (const [key, player] of rowsClaimed) {
    const indices: number[] = JSON.parse(key)
    for (const idx of indices) {
      claimedByIndex.set(idx, player)
    }
  }

  // Spread controls spacing between cells (pinch to collapse, unpinch to spread)
  const [spread, setSpread] = useState(1.0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track initial pinch distance for mobile touch gestures
  const initialPinchDistance = useRef<number | null>(null)
  const initialSpread = useRef<number>(1.0)

  // Attach wheel + touch listeners with { passive: false } to allow preventDefault
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Desktop: wheel/trackpad
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      // deltaY > 0 means pinch in / scroll down = collapse (decrease spread)
      // deltaY < 0 means pinch out / scroll up = spread (increase spread)
      const delta = e.deltaY * -0.002
      setSpread(prev => Math.max(MIN_SPREAD, Math.min(MAX_SPREAD, prev + delta)))
    }

    // Mobile: calculate distance between two touch points
    const getTouchDistance = (touches: TouchList): number => {
      const dx = touches[0].clientX - touches[1].clientX
      const dy = touches[0].clientY - touches[1].clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        initialPinchDistance.current = getTouchDistance(e.touches)
        initialSpread.current = spread
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDistance.current !== null) {
        e.preventDefault()
        const currentDistance = getTouchDistance(e.touches)
        // Ratio of current pinch to initial pinch
        const scale = currentDistance / initialPinchDistance.current
        // Apply scale to initial spread value
        const newSpread = initialSpread.current * scale
        setSpread(Math.max(MIN_SPREAD, Math.min(MAX_SPREAD, newSpread)))
      }
    }

    const handleTouchEnd = () => {
      initialPinchDistance.current = null
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("wheel", handleWheel)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [spread])

  // Convert flat index to 3D coordinates with spread applied
  // Index mapping: index = x + y*3 + z*9
  const indexToPosition = (index: number): [number, number, number] => {
    const x = index % 3
    const y = Math.floor(index / 3) % 3
    const z = Math.floor(index / 9)
    // Center the grid around origin, apply spread multiplier
    return [(x - 1) * spread, (y - 1) * spread, (z - 1) * spread]
  }

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh" }}
    >
      <Canvas camera={{ position: [BASE_CAMERA_DISTANCE, BASE_CAMERA_DISTANCE, BASE_CAMERA_DISTANCE], fov: 50 }}>
        <CameraController />
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />

        {/* Grid of 27 cells */}
        {cells.map((value, index) => (
          <Cell3D
            key={index}
            position={indexToPosition(index)}
            value={value}
            onClick={() => onCellClick?.(index)}
            claimedBy={claimedByIndex.get(index)}
          />
        ))}

        {/* Mouse controls - zoom disabled, replaced by spread */}
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}
