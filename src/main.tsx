import { createRoot } from 'react-dom/client'
import './global.css'

function App() {
    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 p-8">
            <h1 className="text-white text-3xl font-bold font-mono">The Bouncing Ball v3</h1>
        </div>
    )
}

const root = document.getElementById('app')
if (root) createRoot(root).render(<App />)
