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

// Act 1: Cat walks to center (0–1s)
tl.add(scene, { charX: [100, 500], duration: 1000, ease: 'outBack(1.4)' }, 0)
// Anticipation — cat crouches slightly before stopping
tl.add(scene, { charStretchY: [1, 0.92], duration: 200, ease: 'inQuad' }, 800)
tl.add(scene, { charStretchY: [0.92, 1], duration: 300, ease: 'outElastic(1.2, 0.5)' }, 1000)

// Act 2: Anvil bonks the cat (1–2s)
tl.add(scene, { anvilY: [-80, CHAR_Y - 60], duration: 700, ease: 'inQuad' }, 1200)
// Squash on impact — full Tom & Jerry pancake
tl.add(scene, { squashX: [1, 2.2], duration: 150, ease: 'outQuad' }, 1900)
tl.add(scene, { squashY: [1, 0.15], duration: 150, ease: 'outQuad' }, 1900)
// Wobble recovery attempt (but stays squashed)
tl.add(scene, { squashX: [2.2, 1.9], duration: 300, ease: 'inOutSine' }, 2100)
tl.add(scene, { squashY: [0.15, 0.25], duration: 300, ease: 'inOutSine' }, 2100)
// Eyes go dizzy
tl.add(scene, { dizzyAngle: [0, Math.PI * 6], duration: 2000 }, 2000)

// Act 3: Spider-Man swings in (2.5–4s)
tl.add(scene, { spiderX: [1350, 520], duration: 1200, ease: 'outQuad' }, 2500)
tl.add(scene, { spiderY: [0, CHAR_Y - 60], duration: 1200, ease: 'inOutSine' }, 2500)
// Spider-Man landing stretch
tl.add(scene, { spiderStretchY: [1, 0.7], duration: 150, ease: 'outQuad' }, 3700)
tl.add(scene, { spiderStretchY: [0.7, 1.1], duration: 200, ease: 'outElastic(1.2, 0.5)' }, 3850)
tl.add(scene, { spiderStretchY: [1.1, 1], duration: 150 }, 4050)

// Spider grabs anvil and lifts off (4–5s)
tl.add(scene, { spiderX: [520, 900], duration: 1000, ease: 'inOutBack(1.2)' }, 4200)
tl.add(scene, { spiderY: [CHAR_Y - 60, 80], duration: 1000, ease: 'inQuad' }, 4200)
tl.add(scene, { stolenAnvilX: [500, 900], duration: 1000, ease: 'inOutBack(1.2)' }, 4200)
tl.add(scene, { stolenAnvilY: [CHAR_Y - 60, 20], duration: 1000, ease: 'inQuad' }, 4200)

// Act 4: Unicorn gallops in (4.5–6s)
tl.add(scene, { unicornX: [-150, 350], duration: 1200, ease: 'outQuad' }, 4500)
tl.add(scene, { unicornGallop: [0, Math.PI * 8], duration: 1200 }, 4500)

// Act 5: Unicorn charges at Spider-Man (6–7.5s)
tl.add(scene, { unicornX: [350, 880], duration: 1200, ease: 'inQuad' }, 6000)
tl.add(scene, { unicornGallop: [0, Math.PI * 14], duration: 1200 }, 6000)
// Unicorn stretches forward while charging (anticipation)
tl.add(scene, { unicornStretchX: [1, 1.3], duration: 600, ease: 'inQuad' }, 6600)

// Act 6: Spider-Man drops anvil on unicorn — BONK #2 (7.5–8.5s)
tl.add(scene, { stolenAnvilY: [20, CHAR_Y - 10], duration: 500, ease: 'inQuad' }, 7500)
tl.add(scene, { unicornStretchX: [1.3, 1], duration: 200 }, 7500)
// Unicorn pancake squash
tl.add(scene, { uniSquashX: [1, 2.5], duration: 150, ease: 'outQuad' }, 8000)
tl.add(scene, { uniSquashY: [1, 0.12], duration: 150, ease: 'outQuad' }, 8000)
tl.add(scene, { uniSquashX: [2.5, 2.1], duration: 400, ease: 'inOutSine' }, 8200)
tl.add(scene, { uniSquashY: [0.12, 0.2], duration: 400, ease: 'inOutSine' }, 8200)

// Act 7: Cat unsquashes, Spider-Man laughs (8.5–10s)
tl.add(scene, { spiderLaugh: [0, Math.PI * 8], duration: 1500 }, 8500)
tl.add(scene, { squashX: [1.9, 1], duration: 600, ease: 'outElastic(1, 0.3)' }, 8500)
tl.add(scene, { squashY: [0.25, 1], duration: 600, ease: 'outElastic(1, 0.3)' }, 8500)
// Cat slinks away
tl.add(scene, { charX: [500, -100], duration: 1500, ease: 'inQuad' }, 8800)
tl.add(scene, { charStretchY: [1, 0.85], duration: 1500 }, 8800) // slinky walk

// Act 8: Stars + rainbow (9–10.5s)
tl.add(scene, { starAngle: [0, Math.PI * 4], duration: 1500 }, 9000)
tl.add(scene, { rainbowOpacity: [0, 1], duration: 800, ease: 'outQuad' }, 9500)

// --- CARTOON CHARACTER DRAWING ---

function drawCat(x: number, y: number, opts: Options, isDizzy: boolean, dizzyAngle: number) {
  const bodyColor: Options = { ...opts, fill: '#6699cc', fillStyle: 'solid', stroke: '#334466' }
  const bellyColor: Options = { ...opts, fill: '#c8dff0', fillStyle: 'solid', stroke: '#334466' }
  const earColor: Options = { ...opts, fill: '#6699cc', fillStyle: 'solid', stroke: '#334466' }

  const parts = [
    // Tail (behind body)
    gen.line(x - 30, y + 10, x - 65, y - 30, { ...opts, stroke: '#334466', strokeWidth: 4 }),
    gen.line(x - 65, y - 30, x - 55, y - 50, { ...opts, stroke: '#334466', strokeWidth: 4 }),
    // Body — big round torso
    gen.ellipse(x, y + 15, 80, 90, bodyColor),
    // Belly patch
    gen.ellipse(x + 2, y + 25, 45, 50, bellyColor),
    // Left leg (chunky)
    gen.ellipse(x - 20, y + 65, 28, 20, bodyColor),
    // Right leg (chunky)
    gen.ellipse(x + 20, y + 65, 28, 20, bodyColor),
    // Left arm
    gen.ellipse(x - 38, y + 10, 22, 16, bodyColor),
    // Right arm
    gen.ellipse(x + 38, y + 10, 22, 16, bodyColor),
    // Head — large round
    gen.circle(x, y - 45, 70, bodyColor),
    // Left ear
    gen.ellipse(x - 28, y - 82, 18, 24, earColor),
    // Inner left ear
    gen.ellipse(x - 28, y - 82, 10, 14, { ...opts, fill: '#ffaaaa', fillStyle: 'solid', stroke: 'none' }),
    // Right ear
    gen.ellipse(x + 28, y - 82, 18, 24, earColor),
    // Inner right ear
    gen.ellipse(x + 28, y - 82, 10, 14, { ...opts, fill: '#ffaaaa', fillStyle: 'solid', stroke: 'none' }),
    // Nose
    gen.ellipse(x, y - 38, 10, 7, { ...opts, fill: '#ff8888', fillStyle: 'solid', stroke: '#cc4444' }),
    // Mouth
    gen.line(x, y - 34, x - 8, y - 28, { ...opts, stroke: '#334466', strokeWidth: 1.5 }),
    gen.line(x, y - 34, x + 8, y - 28, { ...opts, stroke: '#334466', strokeWidth: 1.5 }),
    // Whiskers
    gen.line(x - 12, y - 36, x - 50, y - 42, { ...opts, stroke: '#334466', strokeWidth: 1 }),
    gen.line(x - 12, y - 33, x - 50, y - 30, { ...opts, stroke: '#334466', strokeWidth: 1 }),
    gen.line(x + 12, y - 36, x + 50, y - 42, { ...opts, stroke: '#334466', strokeWidth: 1 }),
    gen.line(x + 12, y - 33, x + 50, y - 30, { ...opts, stroke: '#334466', strokeWidth: 1 }),
  ]

  // Eyes — normal or dizzy spirals
  if (isDizzy) {
    const ex1 = x - 16 + Math.cos(dizzyAngle) * 4
    const ey1 = y - 52 + Math.sin(dizzyAngle) * 4
    const ex2 = x + 16 + Math.cos(dizzyAngle + Math.PI) * 4
    const ey2 = y - 52 + Math.sin(dizzyAngle + Math.PI) * 4
    parts.push(
      gen.circle(ex1, ey1, 18, { ...opts, stroke: '#334466', strokeWidth: 2 }),
      gen.circle(ex1, ey1, 10, { ...opts, stroke: '#334466', strokeWidth: 1.5 }),
      gen.circle(ex2, ey2, 18, { ...opts, stroke: '#334466', strokeWidth: 2 }),
      gen.circle(ex2, ey2, 10, { ...opts, stroke: '#334466', strokeWidth: 1.5 }),
    )
  } else {
    parts.push(
      gen.circle(x - 16, y - 52, 20, { ...opts, fill: '#fff', fillStyle: 'solid', stroke: '#334466' }),
      gen.circle(x - 14, y - 52, 8, { ...opts, fill: '#222', fillStyle: 'solid', stroke: 'none' }),
      gen.circle(x + 16, y - 52, 20, { ...opts, fill: '#fff', fillStyle: 'solid', stroke: '#334466' }),
      gen.circle(x + 18, y - 52, 8, { ...opts, fill: '#222', fillStyle: 'solid', stroke: 'none' }),
    )
  }

  return parts
}

function drawSpiderMan(x: number, y: number, opts: Options) {
  const suit: Options = { ...opts, fill: '#cc0000', fillStyle: 'solid', stroke: '#880000', strokeWidth: 2 }
  const blue: Options = { ...opts, fill: '#2244aa', fillStyle: 'solid', stroke: '#112266', strokeWidth: 2 }
  const eyes: Options = { ...opts, fill: '#fff', fillStyle: 'solid', stroke: '#222', strokeWidth: 2 }
  const webLine: Options = { ...opts, stroke: '#222', strokeWidth: 0.8 }

  return [
    // Body (muscular torso)
    gen.ellipse(x, y + 10, 55, 80, suit),
    // Blue sides on torso
    gen.ellipse(x - 20, y + 15, 18, 60, blue),
    gen.ellipse(x + 20, y + 15, 18, 60, blue),
    // Head
    gen.circle(x, y - 50, 60, suit),
    // Big angular eyes
    gen.ellipse(x - 14, y - 55, 22, 26, eyes),
    gen.ellipse(x + 14, y - 55, 22, 26, eyes),
    // Web pattern on head (radial lines from nose)
    gen.line(x, y - 40, x - 25, y - 70, webLine),
    gen.line(x, y - 40, x + 25, y - 70, webLine),
    gen.line(x, y - 40, x, y - 80, webLine),
    gen.line(x, y - 40, x - 30, y - 50, webLine),
    gen.line(x, y - 40, x + 30, y - 50, webLine),
    // Left leg (blue)
    gen.ellipse(x - 14, y + 60, 24, 40, blue),
    // Right leg (blue)
    gen.ellipse(x + 14, y + 60, 24, 40, blue),
    // Left foot
    gen.ellipse(x - 18, y + 85, 20, 12, suit),
    // Right foot
    gen.ellipse(x + 18, y + 85, 20, 12, suit),
    // Left arm (reaching out)
    gen.ellipse(x - 40, y - 10, 20, 14, suit),
    // Right arm (reaching out)
    gen.ellipse(x + 40, y - 10, 20, 14, suit),
    // Hands (web-shooting pose)
    gen.circle(x - 52, y - 12, 12, suit),
    gen.circle(x + 52, y - 12, 12, suit),
  ]
}

function drawUnicorn(x: number, y: number, opts: Options) {
  const body: Options = { ...opts, fill: '#f0e0ff', fillStyle: 'solid', stroke: '#9966cc', strokeWidth: 2 }
  const horn: Options = { ...opts, fill: '#ffd700', fillStyle: 'solid', stroke: '#cc9900', strokeWidth: 2 }
  const hoof: Options = { ...opts, fill: '#cc99dd', fillStyle: 'solid', stroke: '#9966cc', strokeWidth: 2 }

  return [
    // Flowing tail (behind body)
    gen.line(x - 55, y, x - 85, y - 30, { ...opts, stroke: '#ff69b4', strokeWidth: 4 }),
    gen.line(x - 55, y + 5, x - 90, y - 15, { ...opts, stroke: '#da70d6', strokeWidth: 4 }),
    gen.line(x - 55, y + 10, x - 80, y + 5, { ...opts, stroke: '#9370db', strokeWidth: 4 }),
    gen.line(x - 55, y - 5, x - 82, y - 40, { ...opts, stroke: '#ff1493', strokeWidth: 3 }),
    // Body — large rounded
    gen.ellipse(x, y, 110, 65, body),
    // Belly highlight
    gen.ellipse(x - 5, y + 8, 70, 35, { ...opts, fill: '#f8f0ff', fillStyle: 'solid', stroke: 'none' }),
    // Neck
    gen.ellipse(x + 45, y - 25, 30, 40, body),
    // Head
    gen.ellipse(x + 65, y - 45, 45, 35, body),
    // Snout
    gen.ellipse(x + 82, y - 38, 20, 18, { ...body, fill: '#e8d0f0' }),
    // Nostril
    gen.circle(x + 88, y - 36, 4, { ...opts, fill: '#cc88dd', fillStyle: 'solid', stroke: 'none' }),
    // Eye (large, expressive)
    gen.circle(x + 68, y - 50, 14, { ...opts, fill: '#fff', fillStyle: 'solid', stroke: '#9966cc' }),
    gen.circle(x + 70, y - 50, 7, { ...opts, fill: '#663399', fillStyle: 'solid', stroke: 'none' }),
    gen.circle(x + 72, y - 53, 3, { ...opts, fill: '#fff', fillStyle: 'solid', stroke: 'none' }),
    // Horn (golden, spiraled)
    gen.line(x + 65, y - 63, x + 65, y - 105, horn),
    gen.line(x + 60, y - 63, x + 65, y - 105, horn),
    gen.line(x + 70, y - 63, x + 65, y - 105, horn),
    // Horn spiral marks
    gen.line(x + 62, y - 75, x + 68, y - 72, { ...opts, stroke: '#cc9900', strokeWidth: 1.5 }),
    gen.line(x + 62, y - 85, x + 68, y - 82, { ...opts, stroke: '#cc9900', strokeWidth: 1.5 }),
    gen.line(x + 63, y - 95, x + 67, y - 92, { ...opts, stroke: '#cc9900', strokeWidth: 1.5 }),
    // Ears
    gen.ellipse(x + 55, y - 65, 10, 18, body),
    gen.ellipse(x + 75, y - 62, 10, 16, body),
    // Mane (flowing rainbow)
    gen.line(x + 50, y - 60, x + 30, y - 75, { ...opts, stroke: '#ff69b4', strokeWidth: 4 }),
    gen.line(x + 45, y - 55, x + 22, y - 68, { ...opts, stroke: '#da70d6', strokeWidth: 4 }),
    gen.line(x + 40, y - 48, x + 18, y - 58, { ...opts, stroke: '#9370db', strokeWidth: 4 }),
    gen.line(x + 35, y - 40, x + 14, y - 48, { ...opts, stroke: '#ff1493', strokeWidth: 3 }),
    // Front legs (chunky with hooves)
    gen.rectangle(x + 20, y + 28, 16, 45, body),
    gen.ellipse(x + 28, y + 75, 18, 10, hoof),
    gen.rectangle(x + 35, y + 28, 16, 45, body),
    gen.ellipse(x + 43, y + 75, 18, 10, hoof),
    // Back legs
    gen.rectangle(x - 30, y + 28, 16, 45, body),
    gen.ellipse(x - 22, y + 75, 18, 10, hoof),
    gen.rectangle(x - 15, y + 28, 16, 45, body),
    gen.ellipse(x - 7, y + 75, 18, 10, hoof),
  ]
}

function drawAnvil(x: number, y: number, opts: Options) {
  return gen.rectangle(x - 35, y, 70, 45, {
    ...opts,
    fill: '#777',
    fillStyle: 'cross-hatch',
    stroke: '#444',
    strokeWidth: 2.5,
  })
}

const RAINBOW = ['#ff0000', '#ff7700', '#ffff00', '#00cc00', '#0066ff', '#8b00ff']

export const TheBonk: React.FC = () => {
  const frame = useCurrentFrame()
  const timeMs = (frame / FPS) * 1000

  tl.seek(timeMs)

  const seed = Math.floor(frame / 2)
  const opts: Options = { roughness: 1.2, strokeWidth: 2, seed }
  const {
    charX, charStretchY, anvilY, squashX, squashY, dizzyAngle,
    spiderX, spiderY, spiderStretchY, stolenAnvilX, stolenAnvilY,
    unicornX, unicornGallop, unicornStretchX, uniSquashX, uniSquashY,
    spiderLaugh, starAngle, rainbowOpacity,
  } = scene

  // Phase checks
  const isSquashed = timeMs >= 1900 && timeMs < 8500
  const isDizzy = timeMs >= 2000 && timeMs < 8500
  const showAnvil = timeMs >= 1200 && timeMs < 4200
  const showStolenAnvil = timeMs >= 4200
  const showSpider = timeMs >= 2500
  const showUnicorn = timeMs >= 4500
  const unicornIsSquashed = timeMs >= 8000
  const showStars = timeMs >= 9000
  const showRainbow = timeMs >= 9500

  // Spider-Man laugh bounce
  const laughBounce = timeMs >= 8500 ? Math.sin(spiderLaugh) * 12 : 0

  // Unicorn gallop
  const gallop = showUnicorn && !unicornIsSquashed ? Math.abs(Math.sin(unicornGallop)) * -18 : 0

  // Character body anchor
  const catBaseY = CHAR_Y + 10

  // Cat parts
  const catParts = drawCat(charX, catBaseY, opts, isDizzy, dizzyAngle)

  // Spider-Man
  const spiderSY = spiderStretchY ?? 1
  const spiderParts = showSpider
    ? drawSpiderMan(spiderX, spiderY + laughBounce, { ...opts, seed: seed + 100 })
    : []

  // Unicorn
  const uStretchX = unicornStretchX ?? 1
  const unicornBaseY = CHAR_Y + 45 + gallop
  const unicornParts = showUnicorn
    ? drawUnicorn(unicornX, unicornBaseY, { ...opts, seed: seed + 200 })
    : []

  // Stars
  const stars = showStars
    ? [0, 1, 2, 3, 4, 5].map(i => {
        const a = starAngle + (i * Math.PI * 2) / 6
        const cx = WIDTH / 2 + Math.cos(a) * 300
        const cy = HEIGHT / 2 - 50 + Math.sin(a) * 130
        return gen.circle(cx, cy, 20, {
          roughness: 0.8, strokeWidth: 2, fill: '#ffcc00', fillStyle: 'solid', seed: seed + i,
        })
      })
    : []

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} style={{ background: '#fffef8' }}>

      {/* Rainbow arc */}
      {showRainbow && (
        <g opacity={rainbowOpacity}>
          {RAINBOW.map((color, i) => (
            <RoughDrawable
              key={`rainbow-${i}`}
              drawable={gen.arc(
                WIDTH / 2, GROUND_Y, 800 - i * 60, 600 - i * 50,
                Math.PI, 0, false,
                { stroke: color, strokeWidth: 5, roughness: 1.5, seed: 42 + i },
              )}
            />
          ))}
        </g>
      )}

      {/* Cat — squashed, stretched, or normal */}
      <g transform={
        isSquashed
          ? `translate(${charX}, ${GROUND_Y}) scale(${squashX}, ${squashY}) translate(${-charX}, ${-GROUND_Y})`
          : `translate(${charX}, ${catBaseY}) scale(1, ${charStretchY ?? 1}) translate(${-charX}, ${-catBaseY})`
      }>
        {catParts.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
      </g>

      {/* Original anvil */}
      {showAnvil && (
        <RoughDrawable drawable={drawAnvil(charX, isSquashed ? CHAR_Y - 60 : anvilY, opts)} />
      )}

      {/* Stolen anvil */}
      {showStolenAnvil && (
        <RoughDrawable drawable={drawAnvil(stolenAnvilX, stolenAnvilY, opts)} />
      )}

      {/* Spider-Man */}
      {showSpider && (
        <>
          {/* Web line */}
          <RoughDrawable drawable={gen.line(
            1300, -20, spiderX, spiderY - 80 + laughBounce,
            { roughness: 0.3, strokeWidth: 1.5, stroke: '#aaa', seed: seed + 50 },
          )} />
          {/* Spider-Man body with stretch */}
          <g transform={`translate(${spiderX}, ${spiderY + laughBounce}) scale(1, ${spiderSY}) translate(${-spiderX}, ${-(spiderY + laughBounce)})`}>
            {spiderParts.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
          </g>
        </>
      )}

      {/* Unicorn — squashed or galloping */}
      {showUnicorn && (
        <g transform={
          unicornIsSquashed
            ? `translate(${unicornX}, ${GROUND_Y}) scale(${uniSquashX}, ${uniSquashY}) translate(${-unicornX}, ${-GROUND_Y})`
            : `translate(${unicornX}, ${unicornBaseY}) scale(${uStretchX}, 1) translate(${-unicornX}, ${-unicornBaseY})`
        }>
          {unicornParts.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
        </g>
      )}

      {/* Stars */}
      {stars.map((d, i) => <RoughDrawable key={i} drawable={d} />)}

      {/* Ground */}
      <RoughDrawable drawable={gen.line(0, GROUND_Y, WIDTH, GROUND_Y, { roughness: 0.8, strokeWidth: 2.5, seed: 1 })} />
    </svg>
  )
}
