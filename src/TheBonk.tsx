import { useEffect, useRef } from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import rough from 'roughjs'

export const TheBonk: React.FC = () => {
  const frame = useCurrentFrame()
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    // Clear previous frame
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    const rc = rough.svg(svg)
    const seed = Math.floor(frame / 2)
    const opts = { roughness: 1.5, strokeWidth: 2, seed }

    // Phase timings (30fps): 0-30 walk, 30-60 fall, 60-90 squash, 90-120 stars
    const charX = interpolate(frame, [0, 30], [100, 500], { extrapolateRight: 'clamp' })
    const charY = 500

    // Draw character (before squash phase)
    if (frame < 60) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      g.appendChild(rc.circle(charX, charY - 80, 60, opts))
      g.appendChild(rc.rectangle(charX - 20, charY - 50, 40, 100, opts))
      g.appendChild(rc.line(charX - 10, charY + 50, charX - 20, charY + 100, opts))
      g.appendChild(rc.line(charX + 10, charY + 50, charX + 20, charY + 100, opts))
      svg.appendChild(g)
    }

    // Falling anvil (frame 30+)
    if (frame >= 30 && frame < 60) {
      const fallProgress = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      const objY = interpolate(fallProgress, [0, 1], [-50, charY - 110])
      svg.appendChild(rc.rectangle(charX - 30, objY, 60, 40, {
        ...opts, fill: '#888', fillStyle: 'cross-hatch',
      }))
    }

    // Squash phase (frame 60+)
    if (frame >= 60) {
      const squashProgress = interpolate(frame, [60, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      const scaleY = interpolate(squashProgress, [0, 1], [1, 0.3])
      const scaleX = interpolate(squashProgress, [0, 1], [1, 1.8])

      // Squashed character
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      g.setAttribute('transform', `translate(${charX}, ${charY + 100}) scale(${scaleX}, ${scaleY}) translate(${-charX}, ${-(charY + 100)})`)
      g.appendChild(rc.circle(charX, charY - 80, 60, { ...opts, roughness: 2 }))
      g.appendChild(rc.rectangle(charX - 20, charY - 50, 40, 100, { ...opts, roughness: 2 }))
      g.appendChild(rc.line(charX - 10, charY + 50, charX - 20, charY + 100, { ...opts, roughness: 2 }))
      g.appendChild(rc.line(charX + 10, charY + 50, charX + 20, charY + 100, { ...opts, roughness: 2 }))
      svg.appendChild(g)

      // Anvil sitting on top
      svg.appendChild(rc.rectangle(charX - 30, charY - 110, 60, 40, {
        ...opts, fill: '#888', fillStyle: 'cross-hatch',
      }))
    }

    // Stars circling head (frame 90+)
    if (frame >= 90) {
      const starAngle = interpolate(frame, [90, 120], [0, Math.PI * 4])
      for (let i = 0; i < 3; i++) {
        const angle = starAngle + (i * Math.PI * 2) / 3
        const starCenterY = charY - 80 * 0.3
        const sx = charX + Math.cos(angle) * 60
        const sy = starCenterY + Math.sin(angle) * 30
        svg.appendChild(rc.circle(sx, sy, 15, {
          roughness: 0.8, strokeWidth: 2, fill: '#ffcc00', fillStyle: 'solid', seed: seed + i,
        }))
      }
    }

    // Ground line
    svg.appendChild(rc.line(0, charY + 110, 1280, charY + 110, { roughness: 1, strokeWidth: 2, seed: 1 }))
  }, [frame])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1280 720"
      width={1280}
      height={720}
      style={{ background: '#ffffff' }}
    />
  )
}
