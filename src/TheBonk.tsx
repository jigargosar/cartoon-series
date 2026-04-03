import { useMemo } from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { RoughGenerator } from 'roughjs/bin/generator'
import type { Drawable, OpSet, Options } from 'roughjs/bin/core'

function opsToPath(opSet: OpSet): string {
  let d = ''
  for (const op of opSet.ops) {
    switch (op.op) {
      case 'move':
        d += `M${op.data[0]} ${op.data[1]} `
        break
      case 'lineTo':
        d += `L${op.data[0]} ${op.data[1]} `
        break
      case 'bcurveTo':
        d += `C${op.data[0]} ${op.data[1]}, ${op.data[2]} ${op.data[3]}, ${op.data[4]} ${op.data[5]} `
        break
    }
  }
  return d
}

function RoughDrawable({ drawable, stroke = '#000', strokeWidth = 2 }: {
  drawable: Drawable
  stroke?: string
  strokeWidth?: number
}) {
  return (
    <g>
      {drawable.sets.map((set, i) => {
        if (set.type === 'path') {
          return <path key={i} d={opsToPath(set)} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
        }
        if (set.type === 'fillPath') {
          return <path key={i} d={opsToPath(set)} fill={drawable.options.fill} stroke="none" />
        }
        if (set.type === 'fillSketch') {
          return <path key={i} d={opsToPath(set)} fill="none" stroke={drawable.options.fill} strokeWidth={drawable.options.fillWeight ?? 0.5} />
        }
        return null
      })}
    </g>
  )
}

const gen = new RoughGenerator()

export const TheBonk: React.FC = () => {
  const frame = useCurrentFrame()

  const scene = useMemo(() => {
    const seed = Math.floor(frame / 2)
    const opts: Options = { roughness: 1.5, strokeWidth: 2, seed }

    const charX = interpolate(frame, [0, 30], [100, 500], { extrapolateRight: 'clamp' })
    const charY = 500

    const character = [
      gen.circle(charX, charY - 80, 60, opts),
      gen.rectangle(charX - 20, charY - 50, 40, 100, opts),
      gen.line(charX - 10, charY + 50, charX - 20, charY + 100, opts),
      gen.line(charX + 10, charY + 50, charX + 20, charY + 100, opts),
    ]

    const squashOpts: Options = { ...opts, roughness: 2 }
    const squashedCharacter = [
      gen.circle(charX, charY - 80, 60, squashOpts),
      gen.rectangle(charX - 20, charY - 50, 40, 100, squashOpts),
      gen.line(charX - 10, charY + 50, charX - 20, charY + 100, squashOpts),
      gen.line(charX + 10, charY + 50, charX + 20, charY + 100, squashOpts),
    ]

    const anvilOpts: Options = { ...opts, fill: '#888', fillStyle: 'cross-hatch' }

    const fallProgress = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    const anvilY = interpolate(fallProgress, [0, 1], [-50, charY - 110])
    const fallingAnvil = gen.rectangle(charX - 30, anvilY, 60, 40, anvilOpts)
    const landedAnvil = gen.rectangle(charX - 30, charY - 110, 60, 40, anvilOpts)

    const squashProgress = interpolate(frame, [60, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    const scaleX = interpolate(squashProgress, [0, 1], [1, 1.8])
    const scaleY = interpolate(squashProgress, [0, 1], [1, 0.3])

    const starAngle = interpolate(frame, [90, 120], [0, Math.PI * 4])
    const stars = [0, 1, 2].map(i => {
      const angle = starAngle + (i * Math.PI * 2) / 3
      const starCenterY = charY - 80 * 0.3
      return gen.circle(
        charX + Math.cos(angle) * 60,
        starCenterY + Math.sin(angle) * 30,
        15,
        { roughness: 0.8, strokeWidth: 2, fill: '#ffcc00', fillStyle: 'solid', seed: seed + i },
      )
    })

    const ground = gen.line(0, charY + 110, 1280, charY + 110, { roughness: 1, strokeWidth: 2, seed: 1 })

    return { charX, charY, character, squashedCharacter, fallingAnvil, landedAnvil, scaleX, scaleY, stars, ground }
  }, [frame])

  const { charX, charY, character, squashedCharacter, fallingAnvil, landedAnvil, scaleX, scaleY, stars, ground } = scene

  return (
    <svg viewBox="0 0 1280 720" width={1280} height={720} style={{ background: '#fff' }}>
      {/* Character (walk phase) */}
      {frame < 60 && (
        <g>
          {character.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
        </g>
      )}

      {/* Falling anvil */}
      {frame >= 30 && frame < 60 && <RoughDrawable drawable={fallingAnvil} />}

      {/* Squashed character */}
      {frame >= 60 && (
        <g transform={`translate(${charX}, ${charY + 100}) scale(${scaleX}, ${scaleY}) translate(${-charX}, ${-(charY + 100)})`}>
          {squashedCharacter.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
        </g>
      )}

      {/* Landed anvil */}
      {frame >= 60 && <RoughDrawable drawable={landedAnvil} />}

      {/* Stars */}
      {frame >= 90 && stars.map((d, i) => <RoughDrawable key={i} drawable={d} />)}

      {/* Ground */}
      <RoughDrawable drawable={ground} />
    </svg>
  )
}
