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
const scene: Record<string, number> = {}

const tl = createTimeline({ autoplay: false })

// Act 1: Stick figure walks to center (0–1s)
tl.add(scene, { charX: [100, 500], duration: 1000, ease: 'outBack(1.4)' }, 0)

// Act 2: Anvil bonks the stick figure (1–2s)
tl.add(scene, { anvilY: [-50, CHAR_Y - 110], duration: 830, ease: 'inQuad' }, 1000)
tl.add(scene, { scaleX: [1, 1.8], scaleY: [1, 0.3], duration: 500, ease: 'outElastic(1.5, 0.4)' }, 2000)

// Act 3: Spider-Man swings in, grabs the anvil (2.5–4s)
tl.add(scene, { spiderX: [1250, 520], duration: 1200, ease: 'outQuad' }, 2500)
tl.add(scene, { spiderY: [30, CHAR_Y - 50], duration: 1200, ease: 'inOutSine' }, 2500)
// Spider-Man grabs anvil and lifts it away (4–5s)
tl.add(scene, { spiderX: [520, 900], duration: 1000, ease: 'inOutBack(1.2)' }, 4000)
tl.add(scene, { spiderY: [CHAR_Y - 50, 100], duration: 1000, ease: 'inQuad' }, 4000)
tl.add(scene, { stolenAnvilX: [500, 900], duration: 1000, ease: 'inOutBack(1.2)' }, 4000)
tl.add(scene, { stolenAnvilY: [CHAR_Y - 110, 40], duration: 1000, ease: 'inQuad' }, 4000)

// Act 4: Unicorn charges in from left, angry (4.5–6s)
tl.add(scene, { unicornX: [-120, 350], duration: 1200, ease: 'outQuad' }, 4500)
tl.add(scene, { unicornBounce: [0, Math.PI * 8], duration: 1200 }, 4500)

// Act 5: Unicorn sees Spider-Man, charges at him (6–7.5s)
tl.add(scene, { unicornX: [350, 880], duration: 1200, ease: 'inQuad' }, 6000)
tl.add(scene, { unicornBounce: [0, Math.PI * 12], duration: 1200 }, 6000)

// Act 6: Spider-Man drops anvil on unicorn — BONK #2 (7.5–8.5s)
tl.add(scene, { stolenAnvilY: [40, CHAR_Y - 50], duration: 600, ease: 'inQuad' }, 7500)
tl.add(scene, { unicornSquashX: [1, 2], duration: 400, ease: 'outElastic(1.5, 0.4)' }, 8100)
tl.add(scene, { unicornSquashY: [1, 0.3], duration: 400, ease: 'outElastic(1.5, 0.4)' }, 8100)

// Act 7: Spider-Man laughs (bounces), stick figure unsquashes and walks away (8.5–10s)
tl.add(scene, { spiderLaugh: [0, Math.PI * 6], duration: 1500 }, 8500)
tl.add(scene, { scaleX: [1.8, 1], scaleY: [0.3, 1], duration: 800, ease: 'outElastic(1, 0.3)' }, 8500)
tl.add(scene, { charX: [500, -80], duration: 1500, ease: 'inQuad' }, 8800)

// Act 8: Stars + rainbow celebration (9–10.5s)
tl.add(scene, { starAngle: [0, Math.PI * 4], duration: 1500 }, 9000)
tl.add(scene, { rainbowOpacity: [0, 1], duration: 800, ease: 'outQuad' }, 9500)

// --- Drawing functions ---

function drawStickFigure(x: number, y: number, opts: Options) {
  return [
    gen.circle(x, y - 80, 60, opts),
    gen.rectangle(x - 20, y - 50, 40, 100, opts),
    gen.line(x - 10, y + 50, x - 20, y + 100, opts),
    gen.line(x + 10, y + 50, x + 20, y + 100, opts),
    // Arms
    gen.line(x - 20, y - 20, x - 45, y + 10, opts),
    gen.line(x + 20, y - 20, x + 45, y + 10, opts),
  ]
}

function drawSpiderMan(x: number, y: number, opts: Options) {
  const bodyOpts: Options = { ...opts, fill: '#cc0000', fillStyle: 'solid', stroke: '#222' }
  const eyeOpts: Options = { ...opts, fill: '#fff', fillStyle: 'solid', stroke: '#222', strokeWidth: 1.5 }
  const webOpts: Options = { ...opts, stroke: '#222', strokeWidth: 1 }

  return [
    gen.circle(x, y - 75, 55, bodyOpts),              // Head
    gen.ellipse(x - 12, y - 80, 18, 22, eyeOpts),     // Left eye
    gen.ellipse(x + 12, y - 80, 18, 22, eyeOpts),     // Right eye
    gen.rectangle(x - 18, y - 48, 36, 85, bodyOpts),   // Body
    gen.line(x, y - 48, x, y + 37, webOpts),           // Web pattern
    gen.line(x - 18, y - 5, x + 18, y - 5, webOpts),
    gen.line(x - 8, y + 37, x - 18, y + 95, { ...bodyOpts, strokeWidth: 2.5 }), // Legs
    gen.line(x + 8, y + 37, x + 18, y + 95, { ...bodyOpts, strokeWidth: 2.5 }),
    gen.line(x - 18, y - 30, x - 50, y - 55, { ...bodyOpts, strokeWidth: 2.5 }), // Arms up
    gen.line(x + 18, y - 30, x + 50, y - 55, { ...bodyOpts, strokeWidth: 2.5 }),
  ]
}

function drawUnicorn(x: number, y: number, opts: Options) {
  const bodyOpts: Options = { ...opts, fill: '#f0e0ff', fillStyle: 'solid', stroke: '#9966cc' }
  const hornOpts: Options = { ...opts, fill: '#ffd700', fillStyle: 'solid', stroke: '#cc9900', strokeWidth: 2 }

  return [
    gen.ellipse(x, y, 90, 55, bodyOpts),                    // Body
    gen.circle(x + 55, y - 30, 35, bodyOpts),               // Head
    gen.line(x + 55, y - 50, x + 55, y - 85, hornOpts),    // Horn
    gen.line(x + 50, y - 50, x + 55, y - 85, hornOpts),
    gen.line(x + 60, y - 50, x + 55, y - 85, hornOpts),
    gen.circle(x + 62, y - 33, 6, { ...opts, fill: '#333', fillStyle: 'solid' }), // Eye
    // Mane
    gen.line(x + 40, y - 42, x + 25, y - 55, { ...opts, stroke: '#ff69b4', strokeWidth: 3 }),
    gen.line(x + 35, y - 38, x + 15, y - 50, { ...opts, stroke: '#da70d6', strokeWidth: 3 }),
    gen.line(x + 30, y - 32, x + 10, y - 42, { ...opts, stroke: '#9370db', strokeWidth: 3 }),
    // Legs
    gen.line(x - 25, y + 25, x - 25, y + 70, { ...bodyOpts, strokeWidth: 3 }),
    gen.line(x - 10, y + 25, x - 10, y + 70, { ...bodyOpts, strokeWidth: 3 }),
    gen.line(x + 10, y + 25, x + 10, y + 70, { ...bodyOpts, strokeWidth: 3 }),
    gen.line(x + 25, y + 25, x + 25, y + 70, { ...bodyOpts, strokeWidth: 3 }),
    // Tail
    gen.line(x - 45, y - 5, x - 70, y - 25, { ...opts, stroke: '#ff69b4', strokeWidth: 3 }),
    gen.line(x - 45, y - 5, x - 75, y - 10, { ...opts, stroke: '#da70d6', strokeWidth: 3 }),
    gen.line(x - 45, y - 5, x - 65, y + 5, { ...opts, stroke: '#9370db', strokeWidth: 3 }),
  ]
}

function drawAnvil(x: number, y: number, opts: Options) {
  return gen.rectangle(x - 30, y, 60, 40, {
    ...opts,
    fill: '#888',
    fillStyle: 'cross-hatch',
  })
}

const RAINBOW = ['#ff0000', '#ff7700', '#ffff00', '#00cc00', '#0066ff', '#8b00ff']

export const TheBonk: React.FC = () => {
  const frame = useCurrentFrame()
  const timeMs = (frame / FPS) * 1000

  tl.seek(timeMs)

  const seed = Math.floor(frame / 2)
  const opts: Options = { roughness: 1.5, strokeWidth: 2, seed }
  const {
    charX, anvilY, scaleX, scaleY,
    spiderX, spiderY, stolenAnvilX, stolenAnvilY,
    unicornX, unicornBounce, unicornSquashX, unicornSquashY,
    spiderLaugh, starAngle, rainbowOpacity,
  } = scene

  // Phase checks
  const isSquashed = timeMs >= 2000 && timeMs < 8500
  const showAnvil = timeMs >= 1000 && timeMs < 4000     // original anvil until spider steals it
  const showStolenAnvil = timeMs >= 4000                 // anvil carried by spider
  const showSpider = timeMs >= 2500
  const showUnicorn = timeMs >= 4500
  const unicornIsSquashed = timeMs >= 8100
  const showStars = timeMs >= 9000
  const showRainbow = timeMs >= 9500

  // Spider-Man laugh bounce
  const laughBounce = timeMs >= 8500 ? Math.sin(spiderLaugh) * 10 : 0

  // Unicorn gallop bounce
  const gallop = showUnicorn ? Math.abs(Math.sin(unicornBounce)) * -15 : 0

  // Characters
  const charParts = drawStickFigure(charX, CHAR_Y, isSquashed ? { ...opts, roughness: 2 } : opts)
  const spiderParts = showSpider
    ? drawSpiderMan(spiderX, spiderY + laughBounce, { ...opts, seed: seed + 100 })
    : []
  const unicornParts = showUnicorn
    ? drawUnicorn(unicornX, CHAR_Y + 30 + gallop, { ...opts, seed: seed + 200 })
    : []

  // Stars around the scene
  const stars = showStars
    ? [0, 1, 2, 3, 4, 5].map(i => {
        const a = starAngle + (i * Math.PI * 2) / 6
        const cx = WIDTH / 2 + Math.cos(a) * 280
        const cy = HEIGHT / 2 + Math.sin(a) * 120
        return gen.circle(cx, cy, 18, {
          roughness: 0.8, strokeWidth: 2, fill: '#ffcc00', fillStyle: 'solid', seed: seed + i,
        })
      })
    : []

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} style={{ background: '#fff' }}>

      {/* Rainbow arc */}
      {showRainbow && (
        <g opacity={rainbowOpacity}>
          {RAINBOW.map((color, i) => (
            <RoughDrawable
              key={`rainbow-${i}`}
              drawable={gen.arc(
                WIDTH / 2, GROUND_Y, 800 - i * 60, 600 - i * 50,
                Math.PI, 0, false,
                { stroke: color, strokeWidth: 4, roughness: 1.5, seed: 42 + i },
              )}
            />
          ))}
        </g>
      )}

      {/* Stick figure — squashed or normal */}
      <g transform={isSquashed
        ? `translate(${charX}, ${GROUND_Y}) scale(${scaleX}, ${scaleY}) translate(${-charX}, ${-GROUND_Y})`
        : undefined
      }>
        {charParts.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
      </g>

      {/* Original anvil (before spider steals it) */}
      {showAnvil && <RoughDrawable drawable={drawAnvil(charX, isSquashed ? CHAR_Y - 110 : anvilY, opts)} />}

      {/* Stolen anvil (spider carries it, then drops on unicorn) */}
      {showStolenAnvil && <RoughDrawable drawable={drawAnvil(stolenAnvilX, stolenAnvilY, opts)} />}

      {/* Spider-Man with web line */}
      {showSpider && (
        <>
          <RoughDrawable drawable={gen.line(
            1250, 0, spiderX, spiderY - 100 + laughBounce,
            { roughness: 0.5, strokeWidth: 1.5, stroke: '#999', seed: seed + 50 },
          )} />
          {spiderParts.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
        </>
      )}

      {/* Unicorn — normal or squashed */}
      {showUnicorn && (
        <g transform={unicornIsSquashed
          ? `translate(${unicornX}, ${GROUND_Y}) scale(${unicornSquashX}, ${unicornSquashY}) translate(${-unicornX}, ${-GROUND_Y})`
          : undefined
        }>
          {unicornParts.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
        </g>
      )}

      {/* Stars */}
      {stars.map((d, i) => <RoughDrawable key={i} drawable={d} />)}

      {/* Ground */}
      <RoughDrawable drawable={gen.line(0, GROUND_Y, WIDTH, GROUND_Y, { roughness: 1, strokeWidth: 2, seed: 1 })} />
    </svg>
  )
}
