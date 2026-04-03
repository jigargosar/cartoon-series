import rough from 'roughjs'
import { createTimeline } from 'animejs'
import type { AnimationParams } from 'animejs'
import type { Scene } from './types.ts'
import { episode1 } from './episodes/ep1.ts'

// --- Cartoon Runtime ---

function playScene(scene: Scene, container: HTMLDivElement) {
    // Create SVG canvas
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', String(scene.width))
    svg.setAttribute('height', String(scene.height))
    svg.setAttribute('viewBox', `0 0 ${scene.width} ${scene.height}`)
    svg.classList.add('bg-sky-100', 'rounded-lg', 'shadow-lg')
    container.querySelector('svg')?.remove()
    container.prepend(svg)

    const rc = rough.svg(svg)

    // Draw all elements
    const elements = new Map<string, SVGGElement>()

    for (const el of scene.elements) {
        let node: SVGGElement
        switch (el.shape) {
            case 'rect':
                node = rc.rectangle(el.x, el.y, el.w, el.h, el.style)
                break
            case 'circle':
                node = rc.circle(el.x, el.y, el.d, el.style)
                break
            case 'ellipse':
                node = rc.ellipse(el.x, el.y, el.w, el.h, el.style)
                break
            case 'line':
                node = rc.line(el.x1, el.y1, el.x2, el.y2, el.style)
                break
            case 'path':
                node = rc.path(el.d, el.style)
                break
        }
        node.setAttribute('id', el.id)
        if (el.transformOrigin) {
            node.style.transformOrigin = el.transformOrigin
        }
        svg.appendChild(node)
        elements.set(el.id, node)
    }

    // Build anime.js timeline from animation steps
    const tl = createTimeline({ autoplay: false })

    for (const step of scene.animations) {
        const params: AnimationParams = { ...step.props, duration: step.duration }
        if (step.easing) params.easing = step.easing
        if (step.delay !== undefined) params.delay = step.delay
        tl.add(`#${step.target}`, params, step.offset ?? 0)
    }

    return { timeline: tl, svg, elements }
}

// --- UI ---

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
<div class="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 p-8">
    <h1 id="scene-title" class="text-white text-2xl font-bold font-mono"></h1>
    <div id="canvas-container"></div>
    <div id="controls" class="flex items-center gap-4 w-[800px]">
        <button id="play-btn" class="px-4 py-2 bg-white rounded shadow text-sm font-mono cursor-pointer hover:bg-gray-100 active:bg-gray-200">Play</button>
        <input id="scrubber" type="range" min="0" max="1000" value="0" step="1" class="flex-1 cursor-pointer" />
        <span id="time" class="text-gray-400 font-mono text-sm w-28 text-right">0 / 0ms</span>
    </div>
    <div id="scene-nav" class="flex items-center gap-3 mt-2"></div>
</div>
`

const canvasContainer = document.getElementById('canvas-container')!
const sceneTitle = document.getElementById('scene-title')!
const scrubber = document.getElementById('scrubber') as HTMLInputElement
const playBtn = document.getElementById('play-btn') as HTMLButtonElement
const timeDisplay = document.getElementById('time') as HTMLSpanElement
const sceneNav = document.getElementById('scene-nav')!

// --- Episode player ---

const scenes = episode1.scenes
let currentTimeline: ReturnType<typeof createTimeline> | null = null

function loadScene(index: number) {
    const scene = scenes[index]
    sceneTitle.textContent = `${episode1.title} — ${scene.name}`

    const { timeline } = playScene(scene, canvasContainer as HTMLDivElement)
    currentTimeline = timeline

    scrubber.max = String(timeline.duration)
    scrubber.value = '0'
    timeDisplay.textContent = `0 / ${Math.round(timeline.duration)}ms`
    playBtn.textContent = 'Play'

    // Update nav buttons
    sceneNav.innerHTML = scenes
        .map((s, i) => {
            const active = i === index
            return `<button class="px-3 py-1 rounded text-sm font-mono cursor-pointer ${active ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}" data-scene="${i}">${i + 1}. ${s.name}</button>`
        })
        .join('')

    // Wire up update callback via a polling approach since createTimeline doesn't support onUpdate
    let rafId = 0
    const tick = () => {
        if (currentTimeline === timeline) {
            scrubber.value = String(timeline.currentTime)
            timeDisplay.textContent = `${Math.round(timeline.currentTime)} / ${Math.round(timeline.duration)}ms`
            if (timeline.completed) {
                playBtn.textContent = 'Play'
            }
            rafId = requestAnimationFrame(tick)
        }
    }
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(tick)
}

// Scene nav clicks
sceneNav.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('button')
    if (btn) {
        const idx = Number(btn.dataset['scene'])
        if (!isNaN(idx)) loadScene(idx)
    }
})

// Play / pause
playBtn.addEventListener('click', () => {
    if (!currentTimeline) return
    if (currentTimeline.paused) {
        if (currentTimeline.completed) currentTimeline.restart()
        else currentTimeline.play()
        playBtn.textContent = 'Pause'
    } else {
        currentTimeline.pause()
        playBtn.textContent = 'Play'
    }
})

// Scrubber
scrubber.addEventListener('input', () => {
    if (!currentTimeline) return
    currentTimeline.pause()
    currentTimeline.seek(Number(scrubber.value))
    playBtn.textContent = 'Play'
})

// Start
loadScene(0)
