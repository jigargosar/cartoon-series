import { useMemo } from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { solid, RoughElement, useSketch, useTimeline, Sketch } from './useCartoon.js'

const W = 800
const H = 450
const viewBox = `${-W / 2} ${-H / 2} ${W} ${H}`

// --- Shared shape builders ---

function drawGround(sk: Sketch) { return sk.rect('ground', -400, 125, 800, 100, solid('#4ade80', '#166534')) }
function drawSun(sk: Sketch, cx = 280, cy = -145, d = 70) { return sk.circle('sun', cx, cy, d, solid('#facc15', '#ca8a04')) }
function drawTree(sk: Sketch, x = 200) {
    return [
        sk.rect('trunk', x - 9, 45, 18, 80, solid('#92400e', '#78350f')),
        sk.circle('leaves', x, 25, 75, solid('#16a34a', '#14532d')),
    ]
}

// --- Scene 1: A Peaceful Day ---

function PeacefulDay() {
    const sk = useSketch()
    const shapes = useMemo(() => ({
        ground: drawGround(sk),
        sun: drawSun(sk),
        cloud1: sk.ellipse('cloud1', -250, -155, 130, 45, solid('white', '#cbd5e1')),
        cloud2: sk.ellipse('cloud2', 50, -125, 100, 35, solid('white', '#cbd5e1')),
        tree: drawTree(sk),
        hill1: sk.ellipse('hill1', -200, 155, 300, 80, solid('#86efac', '#22c55e')),
        hill2: sk.ellipse('hill2', 200, 165, 250, 60, solid('#86efac', '#22c55e')),
    }), [sk])

    // All animations disabled — testing shapes are stable
    useTimeline(() => {})

    return (
        <svg viewBox={viewBox} style={{ background: '#e0f2fe', width: '100%', height: '100%' }}>
            <RoughElement shape={shapes.ground} />
            <RoughElement shape={shapes.sun} />
            <RoughElement shape={shapes.cloud1} />
            <RoughElement shape={shapes.cloud2} />
            {shapes.tree.map(s => <RoughElement key={s.id} shape={s} />)}
            <RoughElement shape={shapes.hill1} />
            <RoughElement shape={shapes.hill2} />
        </svg>
    )
}

// --- Scene 2: Ball Arrives ---

function BallArrives() {
    const sk = useSketch()
    const shapes = useMemo(() => ({
        ground: drawGround(sk),
        sun: drawSun(sk),
        cloud1: sk.ellipse('cloud1', -190, -155, 130, 45, solid('white', '#cbd5e1')),
        tree: drawTree(sk),
        ball: sk.circle('ball', -330, 95, 40, solid('#f87171', '#991b1b')),
    }), [sk])

    useTimeline((tl) => {
        tl.add('#ball', { translateX: [-30, 200], duration: 2000, easing: 'easeOutCubic' }, 0)
        tl.add('#ball', { translateY: [0, -60, 0, -30, 0, -10, 0], duration: 2000, easing: 'easeOutBounce' }, 0)
        tl.add('#ball', { scaleY: [1, 1, 0.7, 1, 0.8, 1, 0.9, 1], duration: 2000, easing: 'easeOutBounce' }, 0)
        tl.add('#cloud1', { translateX: [0, 30], duration: 2000, easing: 'linear' }, 0)
    })

    return (
        <svg viewBox={viewBox} style={{ background: '#e0f2fe', width: '100%', height: '100%' }}>
            <RoughElement shape={shapes.ground} />
            <RoughElement shape={shapes.sun} />
            <RoughElement shape={shapes.cloud1} />
            {shapes.tree.map(s => <RoughElement key={s.id} shape={s} />)}
            <RoughElement shape={shapes.ball} />
        </svg>
    )
}

// --- Scene 3: Exploring ---

function Exploring() {
    const sk = useSketch()
    const shapes = useMemo(() => ({
        ground: drawGround(sk),
        sun: drawSun(sk),
        tree: drawTree(sk),
        ball: sk.circle('ball', -200, 95, 40, solid('#f87171', '#991b1b')),
        stem: sk.line('stem', 0, 125, 0, 85, { stroke: '#16a34a', strokeWidth: 3 }),
        flower: sk.circle('flower', 0, 75, 25, solid('#f472b6', '#db2777')),
    }), [sk])

    useTimeline((tl) => {
        tl.add('#ball', { translateX: [0, 50], duration: 600, easing: 'easeOutCubic' }, 0)
        tl.add('#ball', { translateY: [0, -40, 0], duration: 600, easing: 'easeOutQuad' }, 0)
        tl.add('#ball', { translateX: [50, 120], duration: 600, easing: 'easeOutCubic' }, 1000)
        tl.add('#ball', { translateY: [0, -50, 0], duration: 600, easing: 'easeOutQuad' }, 1000)
        tl.add('#ball', { translateX: [120, 170], duration: 400, easing: 'easeOutCubic' }, 2000)
        tl.add('#ball', { translateY: [0, -20, 0], duration: 400, easing: 'easeOutQuad' }, 2000)
        tl.add('#flower', { rotate: [0, -15, 10, -8, 5, 0], duration: 800, easing: 'easeOutElastic(1, 0.5)' }, 2300)
        tl.add('#stem', { rotate: [0, -10, 7, -4, 0], duration: 800, easing: 'easeOutElastic(1, 0.5)' }, 2300)
        tl.add('#leaves', { rotate: [0, 2, -2, 1, 0], duration: 3500, easing: 'easeInOutSine' }, 0)
    })

    return (
        <svg viewBox={viewBox} style={{ background: '#e0f2fe', width: '100%', height: '100%' }}>
            <RoughElement shape={shapes.ground} />
            <RoughElement shape={shapes.sun} />
            {shapes.tree.map(s => <RoughElement key={s.id} shape={s} />)}
            <RoughElement shape={shapes.ball} />
            <RoughElement shape={shapes.stem} />
            <RoughElement shape={shapes.flower} />
        </svg>
    )
}

// --- Scene 4: Sunset ---

function Sunset() {
    const sk = useSketch()
    const shapes = useMemo(() => ({
        ground: drawGround(sk),
        sun: sk.circle('sun', 0, -25, 80, solid('#fb923c', '#ea580c')),
        tree: drawTree(sk),
        ball: sk.circle('ball', -30, 97, 40, solid('#f87171', '#991b1b')),
        stem: sk.line('stem', 0, 125, 0, 85, { stroke: '#16a34a', strokeWidth: 3 }),
        flower: sk.circle('flower', 0, 75, 25, solid('#f472b6', '#db2777')),
        stars: [
            sk.circle('star1', -300, -165, 6, solid('white', '#e2e8f0')),
            sk.circle('star2', -150, -185, 5, solid('white', '#e2e8f0')),
            sk.circle('star3', 150, -175, 7, solid('white', '#e2e8f0')),
            sk.circle('star4', 300, -190, 4, solid('white', '#e2e8f0')),
        ],
    }), [sk])

    useTimeline((tl) => {
        tl.add('#sun', { translateY: [0, 180], duration: 4000, easing: 'easeInOutSine' }, 0)
        tl.add('#sun', { scale: [1, 1.3], duration: 4000, easing: 'easeInOutSine' }, 0)
        tl.add('#star1', { opacity: [0, 1], duration: 1500, easing: 'easeInOutSine' }, 1500)
        tl.add('#star2', { opacity: [0, 1], duration: 1500, easing: 'easeInOutSine' }, 2000)
        tl.add('#star3', { opacity: [0, 1], duration: 1500, easing: 'easeInOutSine' }, 2500)
        tl.add('#star4', { opacity: [0, 1], duration: 1500, easing: 'easeInOutSine' }, 3000)
        tl.add('#ball', { scaleY: [1, 0.85], duration: 3000, easing: 'easeInOutSine' }, 1000)
    })

    return (
        <svg viewBox={viewBox} style={{ background: '#fef3c7', width: '100%', height: '100%' }}>
            <RoughElement shape={shapes.ground} />
            <RoughElement shape={shapes.sun} />
            {shapes.tree.map(s => <RoughElement key={s.id} shape={s} />)}
            <RoughElement shape={shapes.ball} />
            <RoughElement shape={shapes.stem} />
            <RoughElement shape={shapes.flower} />
            {shapes.stars.map(s => <RoughElement key={s.id} shape={s} />)}
        </svg>
    )
}

// --- Episode ---

const FPS = 30
const S1 = 3000 / 1000 * FPS
const S2 = 2000 / 1000 * FPS
const S3 = 3500 / 1000 * FPS
const S4 = 4500 / 1000 * FPS

export const EPISODE1_DURATION = S1 + S2 + S3 + S4
export const EPISODE1_FPS = FPS

export function Episode1() {
    return (
        <AbsoluteFill>
            <Sequence from={0} durationInFrames={S1} name="A Peaceful Day">
                <PeacefulDay />
            </Sequence>
            <Sequence from={S1} durationInFrames={S2} name="Ball Arrives">
                <BallArrives />
            </Sequence>
            <Sequence from={S1 + S2} durationInFrames={S3} name="Exploring">
                <Exploring />
            </Sequence>
            <Sequence from={S1 + S2 + S3} durationInFrames={S4} name="Sunset">
                <Sunset />
            </Sequence>
        </AbsoluteFill>
    )
}
