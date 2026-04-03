import { createRoot } from 'react-dom/client'
import { Player } from '@remotion/player'
import { Episode1, EPISODE1_DURATION, EPISODE1_FPS } from './Episode1'
import './global.css'

function App() {
    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 p-8">
            <h1 className="text-white text-3xl font-bold font-mono">The Bouncing Ball v3</h1>
            <Player
                component={Episode1}
                durationInFrames={EPISODE1_DURATION}
                fps={EPISODE1_FPS}
                compositionWidth={800}
                compositionHeight={450}
                controls
                style={{ width: 800, height: 450, borderRadius: 12 }}
            />
        </div>
    )
}

const root = document.getElementById('app')
if (root) createRoot(root).render(<App />)
