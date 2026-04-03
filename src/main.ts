import { SVG } from '@svgdotjs/svg.js'
import rough from 'roughjs'
import { createTimeline } from 'animejs'
import type { AnimationParams } from 'animejs'
import type { Episode, Scene } from './types.ts'
import { episode1 } from './episodes/ep1.ts'

// --- Cartoon Runtime ---

function sceneDuration(scene: Scene): number {
    let max = 0
    for (const a of scene.animations) {
        const offset = typeof a.offset === 'number' ? a.offset : 0
        max = Math.max(max, offset + a.duration)
    }
    return max
}

function drawSceneGroup(scene: Scene, index: number, rc: ReturnType<typeof rough.svg>, width: number, height: number): SVGGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.setAttribute('id', `scene-${index}`)
    group.style.display = index === 0 ? '' : 'none'

    // Background rect (plain SVG, not rough)
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    bg.setAttribute('width', String(width))
    bg.setAttribute('height', String(height))
    bg.setAttribute('fill', scene.background)
    group.appendChild(bg)

    // Draw elements with namespaced IDs
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
        node.setAttribute('id', `s${index}-${el.id}`)
        if (el.transformOrigin) node.style.transformOrigin = el.transformOrigin
        group.appendChild(node)
    }

    return group
}

function playEpisode(episode: Episode, container: HTMLDivElement) {
    container.querySelector('svg')?.remove()

    const { width, height } = episode.scenes[0]
    const svg = SVG().addTo(container)
        .size(width, height)
        .viewbox(0, 0, width, height)
        .addClass('rounded-lg shadow-lg')
        .node
    const rc = rough.svg(svg)

    // Calculate when each scene starts on the master timeline
    const sceneOffsets: number[] = []
    let cumulative = 0
    for (const scene of episode.scenes) {
        sceneOffsets.push(cumulative)
        cumulative += sceneDuration(scene)
    }
    const totalDuration = cumulative

    // Draw all scenes and build one master timeline
    const tl = createTimeline({ autoplay: false })
    const sceneGroups: SVGGElement[] = []

    for (let i = 0; i < episode.scenes.length; i++) {
        const scene = episode.scenes[i]
        const group = drawSceneGroup(scene, i, rc, width, height)
        svg.appendChild(group)
        sceneGroups.push(group)

        const baseOffset = sceneOffsets[i]
        for (const step of scene.animations) {
            const stepOffset = typeof step.offset === 'number' ? step.offset : 0
            const params: AnimationParams = { ...step.props, duration: step.duration }
            if (step.easing) params.easing = step.easing
            if (step.delay !== undefined) params.delay = step.delay
            tl.add(`#s${i}-${step.target}`, params, baseOffset + stepOffset)
        }
    }

    // Show the right scene group based on current time
    function updateVisibleScene(time: number) {
        let activeIndex = 0
        for (let i = episode.scenes.length - 1; i >= 0; i--) {
            if (time >= sceneOffsets[i]) {
                activeIndex = i
                break
            }
        }
        for (let i = 0; i < sceneGroups.length; i++) {
            sceneGroups[i].style.display = i === activeIndex ? '' : 'none'
        }
        return activeIndex
    }

    return { timeline: tl, totalDuration, sceneOffsets, updateVisibleScene }
}

// --- UI ---

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
<div class="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 p-8">
    <h1 id="title" class="text-white text-2xl font-bold font-mono"></h1>
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
const titleEl = document.getElementById('title')!
const scrubber = document.getElementById('scrubber') as HTMLInputElement
const playBtn = document.getElementById('play-btn') as HTMLButtonElement
const timeDisplay = document.getElementById('time') as HTMLSpanElement
const sceneNav = document.getElementById('scene-nav')!

// --- Episode player ---

const episode = episode1
const { timeline, totalDuration, sceneOffsets, updateVisibleScene } = playEpisode(episode, canvasContainer as HTMLDivElement)

titleEl.textContent = episode.title
scrubber.max = String(totalDuration)

// Scene nav buttons (seek shortcuts)
sceneNav.innerHTML = episode.scenes
    .map((s, i) => `<button class="px-3 py-1 rounded text-sm font-mono cursor-pointer bg-gray-800 text-gray-400 hover:bg-gray-700" data-scene="${i}">${i + 1}. ${s.name}</button>`)
    .join('')

sceneNav.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('button')
    if (btn) {
        const idx = Number(btn.dataset['scene'])
        if (!isNaN(idx)) {
            timeline.pause()
            timeline.seek(sceneOffsets[idx])
            updateVisibleScene(sceneOffsets[idx])
            playBtn.textContent = 'Play'
        }
    }
})

playBtn.addEventListener('click', () => {
    if (timeline.paused) {
        if (timeline.completed) timeline.restart()
        else timeline.play()
        playBtn.textContent = 'Pause'
    } else {
        timeline.pause()
        playBtn.textContent = 'Play'
    }
})

scrubber.addEventListener('input', () => {
    timeline.pause()
    const time = Number(scrubber.value)
    timeline.seek(time)
    updateVisibleScene(time)
    playBtn.textContent = 'Play'
})

// Sync loop — updates scrubber, time display, and active scene
const tick = () => {
    const time = timeline.currentTime
    scrubber.value = String(time)
    timeDisplay.textContent = `${Math.round(time)} / ${Math.round(totalDuration)}ms`
    updateVisibleScene(time)

    if (timeline.completed) playBtn.textContent = 'Play'

    // Highlight active scene button
    const activeIndex = updateVisibleScene(time)
    const buttons = sceneNav.querySelectorAll('button')
    buttons.forEach((btn, i) => {
        btn.className = `px-3 py-1 rounded text-sm font-mono cursor-pointer ${i === activeIndex ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`
    })

    requestAnimationFrame(tick)
}
requestAnimationFrame(tick)
