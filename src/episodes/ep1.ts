import type { Episode } from '../types.ts'

export const episode1: Episode = {
    title: 'The Bouncing Ball',
    scenes: [
        // --- Scene 1: A peaceful day ---
        {
            name: 'A Peaceful Day',
            width: 800,
            height: 450,
            background: '#e0f2fe',
            elements: [
                // Sky is the SVG background (bg-sky-100)
                // Ground
                { id: 'ground', shape: 'rect', x: 0, y: 350, w: 800, h: 100, style: { fill: '#4ade80', fillStyle: 'solid', stroke: '#166534', roughness: 1.5 } },
                // Sun
                { id: 'sun', shape: 'circle', x: 680, y: 80, d: 70, style: { fill: '#facc15', fillStyle: 'solid', stroke: '#ca8a04', roughness: 1 }, transformOrigin: '680px 80px' },
                // Clouds
                { id: 'cloud1', shape: 'ellipse', x: 150, y: 70, w: 130, h: 45, style: { fill: 'white', fillStyle: 'solid', stroke: '#cbd5e1', roughness: 1.5 } },
                { id: 'cloud2', shape: 'ellipse', x: 450, y: 100, w: 100, h: 35, style: { fill: 'white', fillStyle: 'solid', stroke: '#cbd5e1', roughness: 1.2 } },
                // Tree
                { id: 'trunk', shape: 'rect', x: 600, y: 270, w: 18, h: 80, style: { fill: '#92400e', fillStyle: 'solid', stroke: '#78350f', roughness: 1.8 } },
                { id: 'leaves', shape: 'circle', x: 609, y: 250, d: 75, style: { fill: '#16a34a', fillStyle: 'solid', stroke: '#14532d', roughness: 2 }, transformOrigin: '609px 290px' },
                // Hills in background
                { id: 'hill1', shape: 'ellipse', x: 200, y: 380, w: 300, h: 80, style: { fill: '#86efac', fillStyle: 'solid', stroke: '#22c55e', roughness: 2 } },
                { id: 'hill2', shape: 'ellipse', x: 600, y: 390, w: 250, h: 60, style: { fill: '#86efac', fillStyle: 'solid', stroke: '#22c55e', roughness: 2 } },
            ],
            animations: [
                // Clouds drift slowly
                { target: 'cloud1', props: { translateX: [0, 60] }, duration: 3000, easing: 'linear', offset: 0 },
                { target: 'cloud2', props: { translateX: [0, -40] }, duration: 3000, easing: 'linear', offset: 0 },
                // Sun gently pulses
                { target: 'sun', props: { scale: [1, 1.08, 1] }, duration: 3000, easing: 'easeInOutSine', offset: 0 },
                // Leaves sway in wind
                { target: 'leaves', props: { rotate: [0, 3, -2, 1, 0] }, duration: 3000, easing: 'easeInOutSine', offset: 0 },
            ],
        },

        // --- Scene 2: Ball enters ---
        {
            name: 'Ball Arrives',
            width: 800,
            height: 450,
            background: '#e0f2fe',
            elements: [
                { id: 'ground', shape: 'rect', x: 0, y: 350, w: 800, h: 100, style: { fill: '#4ade80', fillStyle: 'solid', stroke: '#166534', roughness: 1.5 } },
                { id: 'sun', shape: 'circle', x: 680, y: 80, d: 70, style: { fill: '#facc15', fillStyle: 'solid', stroke: '#ca8a04', roughness: 1 } },
                { id: 'cloud1', shape: 'ellipse', x: 210, y: 70, w: 130, h: 45, style: { fill: 'white', fillStyle: 'solid', stroke: '#cbd5e1', roughness: 1.5 } },
                { id: 'trunk', shape: 'rect', x: 600, y: 270, w: 18, h: 80, style: { fill: '#92400e', fillStyle: 'solid', stroke: '#78350f', roughness: 1.8 } },
                { id: 'leaves', shape: 'circle', x: 609, y: 250, d: 75, style: { fill: '#16a34a', fillStyle: 'solid', stroke: '#14532d', roughness: 2 }, transformOrigin: '609px 290px' },
                // The ball — enters from left
                { id: 'ball', shape: 'circle', x: -30, y: 320, d: 40, style: { fill: '#f87171', fillStyle: 'solid', stroke: '#991b1b', roughness: 1.5 } },
            ],
            animations: [
                // Ball rolls in from left
                { target: 'ball', props: { translateX: [-30, 200] }, duration: 2000, easing: 'easeOutCubic', offset: 0 },
                // Ball bounces as it arrives
                { target: 'ball', props: { translateY: [0, -60, 0, -30, 0, -10, 0] }, duration: 2000, easing: 'easeOutBounce', offset: 0 },
                // Ball squashes on landing
                { target: 'ball', props: { scaleY: [1, 1, 0.7, 1, 0.8, 1, 0.9, 1] }, duration: 2000, easing: 'easeOutBounce', offset: 0 },
                // Cloud drifts
                { target: 'cloud1', props: { translateX: [0, 30] }, duration: 2000, easing: 'linear', offset: 0 },
            ],
        },

        // --- Scene 3: Ball explores ---
        {
            name: 'Exploring',
            width: 800,
            height: 450,
            background: '#e0f2fe',
            elements: [
                { id: 'ground', shape: 'rect', x: 0, y: 350, w: 800, h: 100, style: { fill: '#4ade80', fillStyle: 'solid', stroke: '#166534', roughness: 1.5 } },
                { id: 'sun', shape: 'circle', x: 680, y: 80, d: 70, style: { fill: '#facc15', fillStyle: 'solid', stroke: '#ca8a04', roughness: 1 } },
                { id: 'trunk', shape: 'rect', x: 600, y: 270, w: 18, h: 80, style: { fill: '#92400e', fillStyle: 'solid', stroke: '#78350f', roughness: 1.8 } },
                { id: 'leaves', shape: 'circle', x: 609, y: 250, d: 75, style: { fill: '#16a34a', fillStyle: 'solid', stroke: '#14532d', roughness: 2 }, transformOrigin: '609px 290px' },
                // Ball at resting position
                { id: 'ball', shape: 'circle', x: 200, y: 320, d: 40, style: { fill: '#f87171', fillStyle: 'solid', stroke: '#991b1b', roughness: 1.5 } },
                // A flower
                { id: 'stem', shape: 'line', x1: 400, y1: 350, x2: 400, y2: 310, style: { stroke: '#16a34a', strokeWidth: 3, roughness: 1.5 } },
                { id: 'flower', shape: 'circle', x: 400, y: 300, d: 25, style: { fill: '#f472b6', fillStyle: 'solid', stroke: '#db2777', roughness: 2 } },
            ],
            animations: [
                // Ball hops toward the flower
                { target: 'ball', props: { translateX: [0, 50] }, duration: 600, easing: 'easeOutCubic', offset: 0 },
                { target: 'ball', props: { translateY: [0, -40, 0] }, duration: 600, easing: 'easeOutQuad', offset: 0 },
                // Ball pauses, then hops again
                { target: 'ball', props: { translateX: [50, 120] }, duration: 600, easing: 'easeOutCubic', offset: 1000 },
                { target: 'ball', props: { translateY: [0, -50, 0] }, duration: 600, easing: 'easeOutQuad', offset: 1000 },
                // Ball reaches flower, bumps it
                { target: 'ball', props: { translateX: [120, 170] }, duration: 400, easing: 'easeOutCubic', offset: 2000 },
                { target: 'ball', props: { translateY: [0, -20, 0] }, duration: 400, easing: 'easeOutQuad', offset: 2000 },
                // Flower shakes from the bump
                { target: 'flower', props: { rotate: [0, -15, 10, -8, 5, 0] }, duration: 800, easing: 'easeOutElastic(1, 0.5)', offset: 2300 },
                { target: 'stem', props: { rotate: [0, -10, 7, -4, 0] }, duration: 800, easing: 'easeOutElastic(1, 0.5)', offset: 2300 },
                // Leaves sway
                { target: 'leaves', props: { rotate: [0, 2, -2, 1, 0] }, duration: 3500, easing: 'easeInOutSine', offset: 0 },
            ],
        },

        // --- Scene 4: Sunset ---
        {
            name: 'Sunset',
            width: 800,
            height: 450,
            background: '#fef3c7',
            elements: [
                { id: 'ground', shape: 'rect', x: 0, y: 350, w: 800, h: 100, style: { fill: '#4ade80', fillStyle: 'solid', stroke: '#166534', roughness: 1.5 } },
                // Sun lower in sky
                { id: 'sun', shape: 'circle', x: 400, y: 200, d: 80, style: { fill: '#fb923c', fillStyle: 'solid', stroke: '#ea580c', roughness: 1 }, transformOrigin: '400px 200px' },
                { id: 'trunk', shape: 'rect', x: 600, y: 270, w: 18, h: 80, style: { fill: '#78350f', fillStyle: 'solid', stroke: '#451a03', roughness: 1.8 } },
                { id: 'leaves', shape: 'circle', x: 609, y: 250, d: 75, style: { fill: '#15803d', fillStyle: 'solid', stroke: '#14532d', roughness: 2 } },
                // Ball resting next to flower
                { id: 'ball', shape: 'circle', x: 370, y: 322, d: 40, style: { fill: '#f87171', fillStyle: 'solid', stroke: '#991b1b', roughness: 1.5 } },
                { id: 'stem', shape: 'line', x1: 400, y1: 350, x2: 400, y2: 310, style: { stroke: '#16a34a', strokeWidth: 3, roughness: 1.5 } },
                { id: 'flower', shape: 'circle', x: 400, y: 300, d: 25, style: { fill: '#f472b6', fillStyle: 'solid', stroke: '#db2777', roughness: 2 } },
                // Stars appearing
                { id: 'star1', shape: 'circle', x: 100, y: 60, d: 6, style: { fill: 'white', fillStyle: 'solid', stroke: '#e2e8f0', roughness: 0.5 } },
                { id: 'star2', shape: 'circle', x: 250, y: 40, d: 5, style: { fill: 'white', fillStyle: 'solid', stroke: '#e2e8f0', roughness: 0.5 } },
                { id: 'star3', shape: 'circle', x: 550, y: 50, d: 7, style: { fill: 'white', fillStyle: 'solid', stroke: '#e2e8f0', roughness: 0.5 } },
                { id: 'star4', shape: 'circle', x: 700, y: 35, d: 4, style: { fill: 'white', fillStyle: 'solid', stroke: '#e2e8f0', roughness: 0.5 } },
            ],
            animations: [
                // Sun sets
                { target: 'sun', props: { translateY: [0, 180] }, duration: 4000, easing: 'easeInOutSine', offset: 0 },
                { target: 'sun', props: { scale: [1, 1.3] }, duration: 4000, easing: 'easeInOutSine', offset: 0 },
                // Stars fade in
                { target: 'star1', props: { opacity: [0, 1] }, duration: 1500, easing: 'easeInOutSine', offset: 1500 },
                { target: 'star2', props: { opacity: [0, 1] }, duration: 1500, easing: 'easeInOutSine', offset: 2000 },
                { target: 'star3', props: { opacity: [0, 1] }, duration: 1500, easing: 'easeInOutSine', offset: 2500 },
                { target: 'star4', props: { opacity: [0, 1] }, duration: 1500, easing: 'easeInOutSine', offset: 3000 },
                // Ball slowly falls asleep (shrinks slightly)
                { target: 'ball', props: { scaleY: [1, 0.85] }, duration: 3000, easing: 'easeInOutSine', offset: 1000 },
            ],
        },
    ],
}
