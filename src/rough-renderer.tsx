import { RoughGenerator } from 'roughjs/bin/generator'
import type { Drawable, OpSet } from 'roughjs/bin/core'

export const gen = new RoughGenerator()

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

export function RoughDrawable({ drawable, stroke = '#000', strokeWidth = 2 }: {
  drawable: Drawable
  stroke?: string
  strokeWidth?: number
}) {
  return (
    <g>
      {drawable.sets.map((set, i) => {
        if (set.type === 'path') {
          return <path key={i} d={opsToPath(set)} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
        }
        if (set.type === 'fillPath') {
          return <path key={i} d={opsToPath(set)} fill={drawable.options.fill} stroke="none" />
        }
        if (set.type === 'fillSketch') {
          return <path key={i} d={opsToPath(set)} fill="none" stroke={drawable.options.fill} strokeWidth={drawable.options.fillWeight ?? 0.5} />
        }
        return null
      })}
    </g>
  )
}
