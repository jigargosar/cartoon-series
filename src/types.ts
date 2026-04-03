import type { Options as RoughStyle } from 'roughjs/bin/core'

// --- Elements ---

interface BaseEl {
    id: string
    style?: RoughStyle
    transformOrigin?: string
}

export interface RectEl extends BaseEl {
    shape: 'rect'
    x: number
    y: number
    w: number
    h: number
}

export interface CircleEl extends BaseEl {
    shape: 'circle'
    x: number
    y: number
    d: number
}

export interface EllipseEl extends BaseEl {
    shape: 'ellipse'
    x: number
    y: number
    w: number
    h: number
}

export interface LineEl extends BaseEl {
    shape: 'line'
    x1: number
    y1: number
    x2: number
    y2: number
}

export interface PathEl extends BaseEl {
    shape: 'path'
    d: string
}

export type Element = RectEl | CircleEl | EllipseEl | LineEl | PathEl

// --- Animations ---

export interface AnimationStep {
    target: string
    props: Record<string, unknown>
    duration: number
    easing?: string
    delay?: number | ReturnType<typeof import('animejs').stagger>
    offset?: number | string
}

// --- Scene & Episode ---

export interface Scene {
    name: string
    width: number
    height: number
    background: string
    elements: Element[]
    animations: AnimationStep[]
}

export interface Episode {
    title: string
    scenes: Scene[]
}
