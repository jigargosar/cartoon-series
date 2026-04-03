import { Sequence, useCurrentFrame, interpolate, Easing } from 'remotion'
import type { Options } from 'roughjs/bin/core'
import { gen, RoughDrawable } from './rough-renderer'

const WIDTH = 1280
const HEIGHT = 720
const GROUND_Y = 610
function clampedProgress(frame: number, duration: number) {
  return interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

function drawStickFigure(x: number, y: number, opts: Options) {
  return [
    gen.circle(x, y - 80, 60, opts),            // head
    gen.rectangle(x - 20, y - 50, 40, 100, opts), // torso
    gen.line(x - 10, y + 50, x - 20, y + 100, opts), // left leg
    gen.line(x + 10, y + 50, x + 20, y + 100, opts), // right leg
  ]
}

function drawAnvil(x: number, y: number, opts: Options) {
  return gen.rectangle(x - 30, y, 60, 40, {
    ...opts,
    fill: '#888',
    fillStyle: 'cross-hatch',
  })
}

// --- Phase components (each gets local frame via Sequence) ---

const Walk: React.FC = () => {
  const frame = useCurrentFrame()
  const seed = Math.floor(frame / 2)
  const opts: Options = { roughness: 1.5, strokeWidth: 2, seed }

  const progress = clampedProgress(frame, 30)
  const x = interpolate(progress, [0, 1], [100, 500], {
    easing: Easing.out(Easing.cubic),
  })

  const parts = drawStickFigure(x, GROUND_Y - 110, opts)
  return (
    <g>
      {parts.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
    </g>
  )
}

const AnvilFall: React.FC = () => {
  const frame = useCurrentFrame()
  const seed = Math.floor(frame / 2)
  const opts: Options = { roughness: 1.5, strokeWidth: 2, seed }

  const charX = 500
  const charY = GROUND_Y - 110

  // Character standing still
  const parts = drawStickFigure(charX, charY, opts)

  // Anvil accelerating down (ease-in = slow start, fast end)
  const progress = clampedProgress(frame, 25)
  const anvilY = interpolate(progress, [0, 1], [-50, charY - 110], {
    easing: Easing.in(Easing.quad),
  })
  const anvil = drawAnvil(charX, anvilY, opts)

  return (
    <g>
      {parts.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
      <RoughDrawable drawable={anvil} />
    </g>
  )
}

const Squash: React.FC = () => {
  const frame = useCurrentFrame()
  const seed = Math.floor(frame / 2)
  const opts: Options = { roughness: 2, strokeWidth: 2, seed }

  const charX = 500
  const charY = GROUND_Y - 110

  // Elastic squash — overshoots then settles
  const progress = clampedProgress(frame, 15)
  const scaleX = interpolate(progress, [0, 1], [1, 1.8], {
    easing: Easing.out(Easing.elastic(1)),
  })
  const scaleY = interpolate(progress, [0, 1], [1, 0.3], {
    easing: Easing.out(Easing.elastic(1)),
  })

  const parts = drawStickFigure(charX, charY, opts)
  const anvil = drawAnvil(charX, charY - 110, opts)

  return (
    <g>
      <g transform={`translate(${charX}, ${GROUND_Y}) scale(${scaleX}, ${scaleY}) translate(${-charX}, ${-GROUND_Y})`}>
        {parts.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
      </g>
      <RoughDrawable drawable={anvil} />
    </g>
  )
}

const Stars: React.FC = () => {
  const frame = useCurrentFrame()
  const seed = Math.floor(frame / 2)

  const charX = 500
  const starCenterY = GROUND_Y - 110 - 80 * 0.3

  const angle = interpolate(frame, [0, 30], [0, Math.PI * 4])
  const starDrawables = [0, 1, 2].map(i => {
    const a = angle + (i * Math.PI * 2) / 3
    return gen.circle(
      charX + Math.cos(a) * 60,
      starCenterY + Math.sin(a) * 30,
      15,
      { roughness: 0.8, strokeWidth: 2, fill: '#ffcc00', fillStyle: 'solid', seed: seed + i },
    )
  })

  return (
    <g>
      {starDrawables.map((d, i) => <RoughDrawable key={i} drawable={d} />)}
    </g>
  )
}

const Ground: React.FC = () => {
  const ground = gen.line(0, GROUND_Y, WIDTH, GROUND_Y, { roughness: 1, strokeWidth: 2, seed: 1 })
  return <RoughDrawable drawable={ground} />
}

// --- Main composition ---

export const TheBonk: React.FC = () => {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} style={{ background: '#fff' }}>
      <Sequence from={0} durationInFrames={60} layout="none" name="Walk">
        <Walk />
      </Sequence>

      <Sequence from={30} durationInFrames={30} layout="none" name="Anvil Fall">
        <AnvilFall />
      </Sequence>

      <Sequence from={60} layout="none" name="Squash">
        <Squash />
      </Sequence>

      <Sequence from={90} durationInFrames={30} layout="none" name="Stars">
        <Stars />
      </Sequence>

      <Ground />
    </svg>
  )
}
