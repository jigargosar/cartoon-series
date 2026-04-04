import { useEffect, useRef, useState } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { AbsoluteFill, Sequence } from 'remotion'
import { BallSlide, BoxDrop, BALL_FRAMES, BOX_FRAMES, FPS } from './scenes'

const W = 800
const H = 450
const TOTAL_FRAMES = BALL_FRAMES + BOX_FRAMES

const scenes = [
  { name: 'Ball Slide', from: 0, duration: BALL_FRAMES, color: '#4ade80' },
  { name: 'Box Drop', from: BALL_FRAMES, duration: BOX_FRAMES, color: '#f87171' },
]

function Episode() {
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ background: '#fff', width: '100%', height: '100%' }}>
        <Sequence from={0} durationInFrames={BALL_FRAMES} layout="none" name="Ball Slide">
          <BallSlide />
        </Sequence>
        <Sequence from={BALL_FRAMES} durationInFrames={BOX_FRAMES} layout="none" name="Box Drop">
          <BoxDrop />
        </Sequence>
      </svg>
    </AbsoluteFill>
  )
}

function Timeline({ frame }: { frame: number }) {
  const timeMs = (frame / FPS) * 1000

  return (
    <div style={{ width: 800, marginTop: 12 }}>
      <div style={{ display: 'flex', height: 32, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
        {scenes.map((s) => (
          <div
            key={s.name}
            style={{
              width: `${(s.duration / TOTAL_FRAMES) * 100}%`,
              background: s.color,
              opacity: frame >= s.from && frame < s.from + s.duration ? 1 : 0.3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#000',
            }}
          >
            {s.name} ({(s.duration / FPS).toFixed(1)}s)
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            left: `${(frame / TOTAL_FRAMES) * 100}%`,
            top: 0,
            bottom: 0,
            width: 2,
            background: '#fff',
            boxShadow: '0 0 4px rgba(0,0,0,0.5)',
          }}
        />
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#999', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
        <span>frame: {frame} / {TOTAL_FRAMES}</span>
        <span>time: {timeMs.toFixed(0)}ms / {((TOTAL_FRAMES / FPS) * 1000).toFixed(0)}ms</span>
      </div>
    </div>
  )
}

export default function App() {
  const playerRef = useRef<PlayerRef>(null)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    const handler = () => setFrame(player.getCurrentFrame())
    player.addEventListener('frameupdate', handler)
    return () => player.removeEventListener('frameupdate', handler)
  }, [])

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col items-center justify-center">
      <Player
        ref={playerRef}
        component={Episode}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        compositionWidth={W}
        compositionHeight={H}
        controls
        style={{ width: 800, height: 450 }}
      />
      <Timeline frame={frame} />
    </div>
  )
}
