import { useCallback } from 'react'
import { useCartoon, draw } from './useCartoon'

const W = 800
const H = 450
const viewBox = `0 0 ${W} ${H}`

const solid = (fill: string) =>
  ({ fill, fillStyle: 'solid' as const, roughness: 1.5, strokeWidth: 2 })

// Scene 1: A green ball slides across and overshoots to a stop
export function BallSlide() {
  const ref = useCartoon(useCallback(({ svg, rc, tl }) => {
    draw(svg, rc.circle(100, 300, 60, solid('#4ade80')), 'ball')
    draw(svg, rc.line(0, 340, W, 340, { roughness: 1, strokeWidth: 2 }), 'ground')

    tl.add('#ball', { translateX: [0, 500], duration: 1500, ease: 'outBack(1.7)' }, 0)
  }, []))

  return <svg ref={ref} viewBox={viewBox} style={{ background: '#fff', width: '100%', height: '100%' }} />
}

// Scene 2: A red box drops from above and squashes on landing
export function BoxDrop() {
  const ref = useCartoon(useCallback(({ svg, rc, tl }) => {
    draw(svg, rc.rectangle(370, 280, 60, 60, solid('#f87171')), 'box')
    draw(svg, rc.line(0, 340, W, 340, { roughness: 1, strokeWidth: 2 }), 'ground')

    tl.add('#box', { translateY: [-300, 0], duration: 800, ease: 'inQuad' }, 0)
    tl.add('#box', { scaleY: [1, 0.5], scaleX: [1, 1.4], duration: 300, ease: 'outQuad' }, 800)
    tl.add('#box', { scaleY: [0.5, 1], scaleX: [1.4, 1], duration: 500, ease: 'outBounce' }, 1100)
  }, []))

  return <svg ref={ref} viewBox={viewBox} style={{ background: '#fff', width: '100%', height: '100%' }} />
}
