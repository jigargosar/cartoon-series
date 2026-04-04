import { useCurrentFrame } from 'remotion'
import { createTimeline } from 'animejs'
import { circle, rectangle, line } from './rough'

const W = 800
export const FPS = 30

function msToFrames(ms: number) {
  return Math.ceil(ms / 1000 * FPS)
}

const solid = (fill: string) =>
  ({ fill, fillStyle: 'solid' as const, roughness: 1.5, strokeWidth: 2 })

// Scene 1: A green ball slides across and overshoots to a stop

const ballScene: Record<string, number> = {}
const ballTl = createTimeline({ autoplay: false })
const BALL_MS = 6000
ballTl.add(ballScene, { x: [100, 600], duration: BALL_MS, ease: 'outBack(1.7)' }, 0)
export const BALL_FRAMES = msToFrames(BALL_MS)

export function BallSlide() {
  const frame = useCurrentFrame()
  ballTl.seek((frame / FPS) * 1000)

  const timeMs = (frame / FPS) * 1000

  return (
    <g>
      {circle(ballScene.x, 300, 60, { ...solid('#4ade80'), seed: Math.floor((frame / FPS) * 5) })}
      {line(0, 340, W, 340, { roughness: 1, strokeWidth: 2 })}
      <text x={10} y={30} fontSize={16} fontFamily="monospace" fill="#666">
        frame: {frame} | time: {timeMs.toFixed(0)}ms | x: {ballScene.x?.toFixed(0)}
      </text>
    </g>
  )
}

// Scene 2: A red box drops from above and squashes on landing

const boxScene: Record<string, number> = {}
const boxTl = createTimeline({ autoplay: false })
const BOX_MS = 1600
boxTl.add(boxScene, { y: [-20, 280], duration: 800, ease: 'inQuad' }, 0)
boxTl.add(boxScene, { scaleY: [1, 0.5], scaleX: [1, 1.4], duration: 300, ease: 'outQuad' }, 800)
boxTl.add(boxScene, { scaleY: [0.5, 1], scaleX: [1.4, 1], duration: 500, ease: 'outBounce' }, 1100)
export const BOX_FRAMES = msToFrames(BOX_MS)

export function BoxDrop() {
  const frame = useCurrentFrame()
  boxTl.seek((frame / FPS) * 1000)

  const sx = boxScene.scaleX ?? 1
  const sy = boxScene.scaleY ?? 1

  return (
    <g>
      <g transform={`translate(400, ${280 + 60}) scale(${sx}, ${sy}) translate(-400, ${-(280 + 60)})`}>
        {rectangle(370, boxScene.y, 60, 60, solid('#f87171'))}
      </g>
      {line(0, 340, W, 340, { roughness: 1, strokeWidth: 2 })}
    </g>
  )
}
