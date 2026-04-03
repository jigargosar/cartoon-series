import { Player } from '@remotion/player'
import { TheBonk } from './TheBonk'

export default function App() {
  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <Player
        component={TheBonk}
        durationInFrames={120}
        fps={30}
        compositionWidth={1280}
        compositionHeight={720}
        controls
      />
    </div>
  )
}
