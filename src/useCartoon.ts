import { useRef, useEffect } from 'react'
import { useCurrentFrame, useVideoConfig } from 'remotion'
import rough from 'roughjs'
import { createTimeline } from 'animejs'
import type { Timeline } from 'animejs'
import type { RoughSVG } from 'roughjs/bin/svg'

interface CartoonCtx {
    svg: SVGSVGElement
    rc: RoughSVG
    tl: Timeline
}

/** Place a Rough.js node into the SVG with an ID for anime.js targeting. */
export function draw(svg: SVGSVGElement, node: SVGGElement, id: string) {
    node.id = id
    svg.appendChild(node)
}

/**
 * Hook: sets up an SVG canvas with Rough.js + anime.js, driven by Remotion frames.
 *
 * The setup function runs once — draw shapes and add animations.
 * On every frame, the timeline seeks to the corresponding millisecond.
 */
export function useCartoon(setup: (ctx: CartoonCtx) => void) {
    const svgRef = useRef<SVGSVGElement>(null)
    const tlRef = useRef<Timeline | null>(null)
    const frame = useCurrentFrame()
    const { fps } = useVideoConfig()

    useEffect(() => {
        const svg = svgRef.current
        if (!svg) return

        svg.innerHTML = ''
        const rc = rough.svg(svg)
        const tl = createTimeline({ autoplay: false })

        setup({ svg, rc, tl })
        tlRef.current = tl
    }, [setup])

    useEffect(() => {
        tlRef.current?.seek((frame / fps) * 1000)
    }, [frame, fps])

    return svgRef
}
