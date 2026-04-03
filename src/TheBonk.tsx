import { useCurrentFrame } from 'remotion'
import { createTimeline } from 'animejs'
import type { Options } from 'roughjs/bin/core'
import { gen, RoughDrawable } from './rough-renderer'

const WIDTH = 1280
const HEIGHT = 720
const GROUND_Y = 610
const FPS = 30
const CHAR_Y = GROUND_Y - 110

// Scene state — timeline mutates this on seek()
const scene = {
  charX: 100,
  anvilY: -50,
  scaleX: 1,
  scaleY: 1,
  starAngle: 0,
}

// Choreography: all timing and easing in one place
const tl = createTimeline({ autoplay: false })
tl.add(scene, { charX: 500, duration: 1000, ease: 'outBack(1.4)' }, 0)
tl.add(scene, { anvilY: CHAR_Y - 110, duration: 830, ease: 'inQuad' }, 1000)
tl.add(scene, { scaleX: 1.8, scaleY: 0.3, duration: 500, ease: 'outElastic(1.5, 0.4)' }, 2000)
tl.add(scene, { starAngle: Math.PI * 4, duration: 1000 }, 3000)

function drawStickFigure(x: number, y: number, opts: Options) {
  return [
    gen.circle(x, y - 80, 60, opts),
    gen.rectangle(x - 20, y - 50, 40, 100, opts),
    gen.line(x - 10, y + 50, x - 20, y + 100, opts),
    gen.line(x + 10, y + 50, x + 20, y + 100, opts),
  ]
}

function drawAnvil(x: number, y: number, opts: Options) {
  return gen.rectangle(x - 30, y, 60, 40, {
    ...opts,
    fill: '#888',
    fillStyle: 'cross-hatch',
  })
}

export const TheBonk: React.FC = () => {
  const frame = useCurrentFrame()
  const timeMs = (frame / FPS) * 1000

  // Seek timeline — scene values update in place
  tl.seek(timeMs)

  const seed = Math.floor(frame / 2)
  const opts: Options = { roughness: 1.5, strokeWidth: 2, seed }
  const { charX, anvilY, scaleX, scaleY, starAngle } = scene

  // Visibility from time
  const isSquashed = timeMs >= 2000
  const showAnvil = timeMs >= 1000
  const showStars = timeMs >= 3000

  // Character
  const charParts = drawStickFigure(charX, CHAR_Y, isSquashed ? { ...opts, roughness: 2 } : opts)

  // Stars
  const stars = showStars
    ? [0, 1, 2].map(i => {
        const a = starAngle + (i * Math.PI * 2) / 3
        const starCenterY = CHAR_Y - 80 * 0.3
        return gen.circle(
          charX + Math.cos(a) * 60,
          starCenterY + Math.sin(a) * 30,
          15,
          { roughness: 0.8, strokeWidth: 2, fill: '#ffcc00', fillStyle: 'solid', seed: seed + i },
        )
      })
    : []

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} style={{ background: '#fff' }}>
      {/* Character — normal or squashed */}
      <g transform={isSquashed
        ? `translate(${charX}, ${GROUND_Y}) scale(${scaleX}, ${scaleY}) translate(${-charX}, ${-GROUND_Y})`
        : undefined
      }>
        {charParts.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
      </g>

      {/* Anvil — falling or landed */}
      {showAnvil && <RoughDrawable drawable={drawAnvil(charX, isSquashed ? CHAR_Y - 110 : anvilY, opts)} />}

      {/* Stars */}
      {stars.map((d, i) => <RoughDrawable key={i} drawable={d} />)}

      {/* Ground */}
      <RoughDrawable drawable={gen.line(0, GROUND_Y, WIDTH, GROUND_Y, { roughness: 1, strokeWidth: 2, seed: 1 })} />
    </svg>
  )
}
