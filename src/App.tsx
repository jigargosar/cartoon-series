import { Player } from '@remotion/player'
import { AbsoluteFill, Sequence } from 'remotion'
import { BallSlide, BoxDrop } from './scenes'

function Episode() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={60} name="Ball Slide">
        <BallSlide />
      </Sequence>
      <Sequence from={60} durationInFrames={60} name="Box Drop">
        <BoxDrop />
      </Sequence>
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
