import { RoughGenerator } from 'roughjs/bin/generator'
import type { Options, OpSet } from 'roughjs/bin/core'

const gen = new RoughGenerator()

function opsToPath(opSet: OpSet): string {
  let d = ''
  for (const op of opSet.ops) {
    switch (op.op) {
      case 'move':
        d += `M${op.data[0]} ${op.data[1]} `
        break
      case 'lineTo':
        d += `L${op.data[0]} ${op.data[1]} `
        break
      case 'bcurveTo':
        d += `C${op.data[0]} ${op.data[1]}, ${op.data[2]} ${op.data[3]}, ${op.data[4]} ${op.data[5]} `
        break
    }
  }
  return d
}

function drawableToPaths(drawable: { sets: OpSet[]; options: Options }) {
  return drawable.sets.map((set, i) => {
    if (set.type === 'path') {
      return <path key={i} d={opsToPath(set)} fill="none" stroke={drawable.options.stroke ?? '#000'} strokeWidth={drawable.options.strokeWidth ?? 2} />
    }
    if (set.type === 'fillPath') {
      return <path key={i} d={opsToPath(set)} fill={String(drawable.options.fill)} stroke="none" />
    }
    if (set.type === 'fillSketch') {
      return <path key={i} d={opsToPath(set)} fill="none" stroke={String(drawable.options.fill)} strokeWidth={drawable.options.fillWeight ?? 0.5} />
    }
    return null
  })
}

export function circle(x: number, y: number, diameter: number, opts: Options = {}) {
  return <g>{drawableToPaths(gen.circle(x, y, diameter, opts))}</g>
}

export function rectangle(x: number, y: number, w: number, h: number, opts: Options = {}) {
  return <g>{drawableToPaths(gen.rectangle(x, y, w, h, opts))}</g>
}

export function line(x1: number, y1: number, x2: number, y2: number, opts: Options = {}) {
  return <g>{drawableToPaths(gen.line(x1, y1, x2, y2, opts))}</g>
}
