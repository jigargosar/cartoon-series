import { Player } from '@remotion/player'
import { AbsoluteFill, Sequence } from 'remotion'
import { BallSlide, BoxDrop } from './scenes'

const W = 800
const H = 450

function Episode() {
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ background: '#fff', width: '100%', height: '100%' }}>
        <Sequence from={0} durationInFrames={60} layout="none" name="Ball Slide">
          <BallSlide />
        </Sequence>
        <Sequence from={60} durationInFrames={60} layout="none" name="Box Drop">
          <BoxDrop />
        </Sequence>
      </svg>
    </AbsoluteFill>
  )
}

export default function App() {
  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <Player
        component={Episode}
        durationInFrames={120}
        fps={30}
        compositionWidth={800}
        compositionHeight={450}
        controls
        style={{ width: 800, height: 450 }}
      />
    </div>
  )
}
