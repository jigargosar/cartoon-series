import { useCurrentFrame, useVideoConfig } from 'remotion'
import { createTimeline } from 'animejs'
import type { SVGAttributes } from 'react'

interface CharDef {
    x: number
    y: number
    size: number
    fill: string
}

interface Beat {
    t: number
    ease?: string
    [charName: string]: unknown
}

interface SceneData {
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
    }

    for (let i = 1; i < scene.beats.length; i++) {
        const prev = scene.beats[i - 1]
        const beat = scene.beats[i]
        const duration = beat.t - prev.t
        const ease = beat.ease ?? 'linear'

        for (const [name] of Object.entries(scene.characters)) {
            const charBeat = beat[name]
            if (charBeat && typeof charBeat === 'object') {
                tl.add(state[name], { ...charBeat as Record<string, number>, duration, ease }, prev.t)
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
                            style: { translate: `${s.x}px ${s.y}px` },
                        })}
                    </g>
                )
            })}
        </>
    )
}
