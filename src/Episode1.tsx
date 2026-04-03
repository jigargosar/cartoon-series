import { useCallback } from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { useCartoon, draw } from './useCartoon'
import type { RoughSVG } from 'roughjs/bin/svg'

const W = 800
const H = 450
const viewBox = `${-W / 2} ${-H / 2} ${W} ${H}`

// --- Shared rough styles ---

const solid = (fill: string, stroke: string, roughness = 1.5) =>
    ({ fill, fillStyle: 'solid' as const, stroke, roughness })

// --- Shared drawing helpers ---

function drawGround(svg: SVGSVGElement, rc: RoughSVG) {
    draw(svg, rc.rectangle(-400, 125, 800, 100, solid('#4ade80', '#166534')), 'ground')
}

function drawSun(svg: SVGSVGElement, rc: RoughSVG, x = 280, y = -145, d = 70) {
    draw(svg, rc.circle(x, y, d, solid('#facc15', '#ca8a04', 1)), 'sun')
}

function drawTree(svg: SVGSVGElement, rc: RoughSVG, x = 200) {
    draw(svg, rc.rectangle(x - 9, 45, 18, 80, solid('#92400e', '#78350f', 1.8)), 'trunk')
    draw(svg, rc.circle(x, 25, 75, solid('#16a34a', '#14532d', 2)), 'leaves')
}

// --- Scene 1: A Peaceful Day ---

function PeacefulDay() {
    const ref = useCartoon(useCallback(({ svg, rc, tl }) => {
        drawGround(svg, rc)
        drawSun(svg, rc)
        draw(svg, rc.ellipse(-250, -155, 130, 45, solid('white', '#cbd5e1')), 'cloud1')
        draw(svg, rc.ellipse(50, -125, 100, 35, solid('white', '#cbd5e1', 1.2)), 'cloud2')
        drawTree(svg, rc)
        draw(svg, rc.ellipse(-200, 155, 300, 80, solid('#86efac', '#22c55e', 2)), 'hill1')
        draw(svg, rc.ellipse(200, 165, 250, 60, solid('#86efac', '#22c55e', 2)), 'hill2')

        tl.add('#cloud1', { translateX: [0, 60], duration: 3000, easing: 'linear' }, 0)
        tl.add('#cloud2', { translateX: [0, -40], duration: 3000, easing: 'linear' }, 0)
        tl.add('#sun', { scale: [1, 1.08, 1], duration: 3000, easing: 'easeInOutSine' }, 0)
        tl.add('#leaves', { rotate: [0, 3, -2, 1, 0], duration: 3000, easing: 'easeInOutSine' }, 0)
    }, []))

    return <svg ref={ref} viewBox={viewBox} style={{ background: '#e0f2fe', width: '100%', height: '100%' }} />
}

// --- Scene 2: Ball Arrives ---

function BallArrives() {
    const ref = useCartoon(useCallback(({ svg, rc, tl }) => {
        drawGround(svg, rc)
        drawSun(svg, rc)
        draw(svg, rc.ellipse(-190, -155, 130, 45, solid('white', '#cbd5e1')), 'cloud1')
        drawTree(svg, rc)
        draw(svg, rc.circle(-430, 95, 40, solid('#f87171', '#991b1b')), 'ball')

        tl.add('#ball', { translateX: [-30, 200], duration: 2000, easing: 'easeOutCubic' }, 0)
        tl.add('#ball', { translateY: [0, -60, 0, -30, 0, -10, 0], duration: 2000, easing: 'easeOutBounce' }, 0)
        tl.add('#ball', { scaleY: [1, 1, 0.7, 1, 0.8, 1, 0.9, 1], duration: 2000, easing: 'easeOutBounce' }, 0)
        tl.add('#cloud1', { translateX: [0, 30], duration: 2000, easing: 'linear' }, 0)
    }, []))

    return (
        <svg ref={ref} viewBox={viewBox} style={{ background: '#e0f2fe', width: '100%', height: '100%' }}>
            <text x={0} y={-180} textAnchor="middle" fill="#334155" fontFamily="monospace" fontSize={24}>
                Scene 2: Ball Arrives
            </text>
        </svg>
    )
}

// --- Scene 3: Exploring ---

function Exploring() {
    const ref = useCartoon(useCallback(({ svg, rc, tl }) => {
        drawGround(svg, rc)
        drawSun(svg, rc)
        drawTree(svg, rc)
        draw(svg, rc.circle(-200, 95, 40, solid('#f87171', '#991b1b')), 'ball')
        draw(svg, rc.line(0, 125, 0, 85, { stroke: '#16a34a', strokeWidth: 3, roughness: 1.5 }), 'stem')
        draw(svg, rc.circle(0, 75, 25, solid('#f472b6', '#db2777', 2)), 'flower')

        // Hop 1
        tl.add('#ball', { translateX: [0, 50], duration: 600, easing: 'easeOutCubic' }, 0)
        tl.add('#ball', { translateY: [0, -40, 0], duration: 600, easing: 'easeOutQuad' }, 0)
        // Hop 2
        tl.add('#ball', { translateX: [50, 120], duration: 600, easing: 'easeOutCubic' }, 1000)
        tl.add('#ball', { translateY: [0, -50, 0], duration: 600, easing: 'easeOutQuad' }, 1000)
        // Hop 3 — bumps flower
        tl.add('#ball', { translateX: [120, 170], duration: 400, easing: 'easeOutCubic' }, 2000)
        tl.add('#ball', { translateY: [0, -20, 0], duration: 400, easing: 'easeOutQuad' }, 2000)
        // Flower reacts
        tl.add('#flower', { rotate: [0, -15, 10, -8, 5, 0], duration: 800, easing: 'easeOutElastic(1, 0.5)' }, 2300)
        tl.add('#stem', { rotate: [0, -10, 7, -4, 0], duration: 800, easing: 'easeOutElastic(1, 0.5)' }, 2300)
        // Background life
        tl.add('#leaves', { rotate: [0, 2, -2, 1, 0], duration: 3500, easing: 'easeInOutSine' }, 0)
    }, []))

    return <svg ref={ref} viewBox={viewBox} style={{ background: '#e0f2fe', width: '100%', height: '100%' }} />
}

// --- Scene 4: Sunset ---

function Sunset() {
    const ref = useCartoon(useCallback(({ svg, rc, tl }) => {
        drawGround(svg, rc)
        draw(svg, rc.circle(0, -25, 80, solid('#fb923c', '#ea580c', 1)), 'sun')
        drawTree(svg, rc, 200)
        draw(svg, rc.circle(-30, 97, 40, solid('#f87171', '#991b1b')), 'ball')
        draw(svg, rc.line(0, 125, 0, 85, { stroke: '#16a34a', strokeWidth: 3, roughness: 1.5 }), 'stem')
        draw(svg, rc.circle(0, 75, 25, solid('#f472b6', '#db2777', 2)), 'flower')
        draw(svg, rc.circle(-300, -165, 6, solid('white', '#e2e8f0', 0.5)), 'star1')
        draw(svg, rc.circle(-150, -185, 5, solid('white', '#e2e8f0', 0.5)), 'star2')
        draw(svg, rc.circle(150, -175, 7, solid('white', '#e2e8f0', 0.5)), 'star3')
        draw(svg, rc.circle(300, -190, 4, solid('white', '#e2e8f0', 0.5)), 'star4')

        tl.add('#sun', { translateY: [0, 180], duration: 4000, easing: 'easeInOutSine' }, 0)
        tl.add('#sun', { scale: [1, 1.3], duration: 4000, easing: 'easeInOutSine' }, 0)
        tl.add('#star1', { opacity: [0, 1], duration: 1500, easing: 'easeInOutSine' }, 1500)
        tl.add('#star2', { opacity: [0, 1], duration: 1500, easing: 'easeInOutSine' }, 2000)
        tl.add('#star3', { opacity: [0, 1], duration: 1500, easing: 'easeInOutSine' }, 2500)
        tl.add('#star4', { opacity: [0, 1], duration: 1500, easing: 'easeInOutSine' }, 3000)
        tl.add('#ball', { scaleY: [1, 0.85], duration: 3000, easing: 'easeInOutSine' }, 1000)
    }, []))

    return <svg ref={ref} viewBox={viewBox} style={{ background: '#fef3c7', width: '100%', height: '100%' }} />
}

// --- Episode: all scenes sequenced ---

// Scene durations in frames (30 fps)
const FPS = 30
const S1 = 3000 / 1000 * FPS  // 90
const S2 = 2000 / 1000 * FPS  // 60
const S3 = 3500 / 1000 * FPS  // 105
const S4 = 4500 / 1000 * FPS  // 135

export const EPISODE1_DURATION = S1 + S2 + S3 + S4  // 390 frames = 13s
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
