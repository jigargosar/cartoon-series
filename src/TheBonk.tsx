import { useEffect, useRef } from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import rough from 'roughjs'

export const TheBonk: React.FC = () => {
  const frame = useCurrentFrame()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, 1280, 720)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 1280, 720)

    const rc = rough.canvas(canvasRef.current)
    const seed = Math.floor(frame / 2)

    // Phase timings (30fps): 0-30 walk, 30-60 fall, 60-90 squash, 90-120 stars

    // Character position
    const charX = interpolate(frame, [0, 30], [100, 500], { extrapolateRight: 'clamp' })
    const charY = 500

    // Draw character (before squash phase)
    if (frame < 60) {
      rc.circle(charX, charY - 80, 60, { roughness: 1.5, strokeWidth: 2, seed })
      rc.rectangle(charX - 20, charY - 50, 40, 100, { roughness: 1.5, strokeWidth: 2, seed })
      // Legs
      rc.line(charX - 10, charY + 50, charX - 20, charY + 100, { roughness: 1.5, strokeWidth: 2, seed })
      rc.line(charX + 10, charY + 50, charX + 20, charY + 100, { roughness: 1.5, strokeWidth: 2, seed })
    }

    // Falling object (anvil shape) - visible from frame 30
    if (frame >= 30) {
      const fallProgress = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      const objY = interpolate(fallProgress, [0, 1], [-50, charY - 110])

      rc.rectangle(charX - 30, objY, 60, 40, {
        roughness: 1.5,
        strokeWidth: 2,
        fill: '#888',
        fillStyle: 'cross-hatch',
        seed,
      })
    }

    // Squash phase - flatten the character
    if (frame >= 60) {
      const squashProgress = interpolate(frame, [60, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      const scaleY = interpolate(squashProgress, [0, 1], [1, 0.3])
      const squashWidth = interpolate(squashProgress, [0, 1], [1, 1.8])

      ctx.save()
      ctx.translate(charX, charY + 100)
      ctx.scale(squashWidth, scaleY)
      ctx.translate(-charX, -(charY + 100))

      rc.circle(charX, charY - 80, 60, { roughness: 2, strokeWidth: 2, seed })
      rc.rectangle(charX - 20, charY - 50, 40, 100, { roughness: 2, strokeWidth: 2, seed })
      rc.line(charX - 10, charY + 50, charX - 20, charY + 100, { roughness: 2, strokeWidth: 2, seed })
      rc.line(charX + 10, charY + 50, charX + 20, charY + 100, { roughness: 2, strokeWidth: 2, seed })

      ctx.restore()

      // Anvil sitting on top
      rc.rectangle(charX - 30, charY - 110, 60, 40, {
        roughness: 1.5,
        strokeWidth: 2,
        fill: '#888',
        fillStyle: 'cross-hatch',
        seed,
      })
    }

    // Stars circling head (frame 90+)
    if (frame >= 90) {
      const starAngle = interpolate(frame, [90, 120], [0, Math.PI * 4])
      const numStars = 3
      for (let i = 0; i < numStars; i++) {
        const angle = starAngle + (i * Math.PI * 2) / numStars
        const radius = 60
        const starCenterY = charY - 80 * 0.3 // adjusted for squash
        const sx = charX + Math.cos(angle) * radius
        const sy = starCenterY + Math.sin(angle) * radius * 0.5

        rc.circle(sx, sy, 15, { roughness: 0.8, strokeWidth: 2, fill: '#ffcc00', fillStyle: 'solid', seed: seed + i })
      }
    }

    // Ground line
    rc.line(0, charY + 110, 1280, charY + 110, { roughness: 1, strokeWidth: 2, seed: 1 })
  }, [frame])

  return (
    <canvas
      ref={canvasRef}
      width={1280}
      height={720}
    />
  )
}
