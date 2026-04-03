import { useRef, useEffect, useMemo } from 'react'
import { useCurrentFrame, useVideoConfig } from 'remotion'
import rough from 'roughjs'
import { createTimeline } from 'animejs'
import type { Timeline } from 'animejs'
import type { Options as RoughStyle } from 'roughjs/bin/core'

// --- Rough.js → React SVG paths (no DOM) ---

const gen = rough.generator()

export interface RoughShape {
    id: string
    paths: Array<{ d: string; stroke?: string; strokeWidth?: number; fill?: string }>
}

/**
 * A drawing context with a base seed for wobble.
 * Each shape gets a unique seed derived from the base so they
 * wobble independently but deterministically.
 */
export class Sketch {
    constructor(private baseSeed: number, private defaults: RoughStyle = {}) {}

    private opts(id: string, style?: RoughStyle): RoughStyle {
        // Derive a stable seed from the id string — same id always = same seed
        let hash = 0
        for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
        return { ...this.defaults, seed: Math.abs(hash) + this.baseSeed, ...style }
    }

    circle(id: string, cx: number, cy: number, d: number, style?: RoughStyle): RoughShape {
        return { id, paths: gen.toPaths(gen.circle(cx, cy, d, this.opts(id, style))) }
    }

    rect(id: string, x: number, y: number, w: number, h: number, style?: RoughStyle): RoughShape {
        return { id, paths: gen.toPaths(gen.rectangle(x, y, w, h, this.opts(id, style))) }
    }

    ellipse(id: string, cx: number, cy: number, w: number, h: number, style?: RoughStyle): RoughShape {
        return { id, paths: gen.toPaths(gen.ellipse(cx, cy, w, h, this.opts(id, style))) }
    }

    line(id: string, x1: number, y1: number, x2: number, y2: number, style?: RoughStyle): RoughShape {
        return { id, paths: gen.toPaths(gen.line(x1, y1, x2, y2, this.opts(id, style))) }
    }

    path(id: string, d: string, style?: RoughStyle): RoughShape {
        return { id, paths: gen.toPaths(gen.path(d, this.opts(id, style))) }
    }
}

// --- Style shorthand ---

export function solid(fill: string, stroke: string): RoughStyle {
    return { fill, fillStyle: 'solid', stroke }
}

// --- React component for a rough shape ---

export function RoughElement({ shape }: { shape: RoughShape }) {
    return (
        <g id={shape.id}>
            {shape.paths.map((p, i) => (
                <path
                    key={i}
                    d={p.d}
                    fill={p.fill}
                    stroke={p.stroke}
                    strokeWidth={p.strokeWidth}
                />
            ))}
        </g>
    )
}

// --- Wobble: returns a frame counter at a slower rate ---

export function useWobbleFrame(interval = 10) {
    const frame = useCurrentFrame()
    return Math.floor(frame / interval)
}

/** Create a Sketch bound to the current wobble frame. Memoized — only regenerates on wobble tick. */
export function useSketch(roughness = 0.8) {
    return useMemo(() => new Sketch(1, { roughness, bowing: 0.5 }), [roughness])
}

// --- Timeline hook: anime.js driven by Remotion frames ---

export function useTimeline(setup: (tl: Timeline) => void) {
    const tlRef = useRef<Timeline | null>(null)
    const frame = useCurrentFrame()
    const { fps } = useVideoConfig()

    const stableSetup = useMemo(() => setup, [])

    useEffect(() => {
        const tl = createTimeline({ autoplay: false })
        stableSetup(tl)
        tlRef.current = tl
    }, [stableSetup])

    useEffect(() => {
        tlRef.current?.seek((frame / fps) * 1000)
    }, [frame, fps])
}
