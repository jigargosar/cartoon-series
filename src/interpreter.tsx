import { useCurrentFrame, useVideoConfig } from 'remotion'
import { createTimeline } from 'animejs'
import type { SVGAttributes } from 'react'

export interface CharDef {
    x: number
    y: number
    size: number
    fill: string
    [prop: string]: unknown
}

export interface Beat {
    t: number
    ease?: string
    [charName: string]: unknown
}

export interface SceneData {
    characters: Record<string, CharDef>
    beats: Beat[]
}

function rect(w: number, h: number, attrs?: SVGAttributes<SVGRectElement>) {
    return <rect x={-w / 2} y={-h / 2} width={w} height={h} {...attrs} />
}

function buildTimeline(scene: SceneData) {
    const state: Record<string, Record<string, number>> = {}
    const tl = createTimeline({ autoplay: false })

    for (const [name, def] of Object.entries(scene.characters)) {
        state[name] = { x: def.x, y: def.y }
        if (typeof def.rotate === 'number') state[name].rotate = def.rotate
    }

    for (let i = 1; i < scene.beats.length; i++) {
        const prev = scene.beats[i - 1]
        const beat = scene.beats[i]
        const duration = beat.t - prev.t
        const ease = beat.ease ?? 'linear'

        for (const [name] of Object.entries(scene.characters)) {
            const charBeat = beat[name]
            if (charBeat && typeof charBeat === 'object') {
                const props = charBeat as Record<string, number | { to: number; ease?: string; endAt?: number }>
                for (const [prop, val] of Object.entries(props)) {
                    if (typeof val === 'object' && val !== null) {
                        const propDuration = val.endAt ? val.endAt - prev.t : duration
                        tl.add(state[name], { [prop]: val.to, duration: propDuration, ease: val.ease ?? ease }, prev.t)
                    } else {
                        tl.add(state[name], { [prop]: val, duration, ease }, prev.t)
                    }
                }
            }
        }
    }

    return { state, tl }
}

export function SceneRenderer({ data }: { data: SceneData }) {
    const frame = useCurrentFrame()
    const { fps } = useVideoConfig()
    const { state, tl } = buildTimeline(data)

    tl.seek((frame / fps) * 1000)

    return (
        <>
            {Object.entries(data.characters).map(([name, def]) => {
                const s = state[name]
                return (
                    <g key={name}>
                        {rect(def.size, def.size, {
                            fill: def.fill,
                            style: {
                                translate: `${s.x}px ${s.y}px`,
                                rotate: `${s.rotate ?? 0}deg`,
                            },
                        })}
                    </g>
                )
            })}
        </>
    )
}
