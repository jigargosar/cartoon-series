import { useCallback } from 'react'
import { useCartoon, draw } from './useCartoon'

const WIDTH = 1280
const HEIGHT = 720
const GROUND_Y = 610
const CHAR_Y = GROUND_Y - 110
const CHAR_X_END = 500

const sketch = { roughness: 1.5, strokeWidth: 2 }
const anvilStyle = { ...sketch, fill: '#888', fillStyle: 'cross-hatch' as const }
const starStyle = { roughness: 0.8, strokeWidth: 2, fill: '#ffcc00', fillStyle: 'solid' as const }

export const TheBonk: React.FC = () => {
  const ref = useCartoon(useCallback(({ svg, rc, tl }) => {
    // Character parts
    draw(svg, rc.circle(CHAR_X_END, CHAR_Y - 80, 60, sketch), 'head')
    draw(svg, rc.rectangle(CHAR_X_END - 20, CHAR_Y - 50, 40, 100, sketch), 'torso')
    draw(svg, rc.line(CHAR_X_END - 10, CHAR_Y + 50, CHAR_X_END - 20, CHAR_Y + 100, sketch), 'leg-l')
    draw(svg, rc.line(CHAR_X_END + 10, CHAR_Y + 50, CHAR_X_END + 20, CHAR_Y + 100, sketch), 'leg-r')

    // Anvil
    draw(svg, rc.rectangle(CHAR_X_END - 30, CHAR_Y - 110, 60, 40, anvilStyle), 'anvil')

    // Stars
    draw(svg, rc.circle(CHAR_X_END + 60, CHAR_Y - 104, 15, starStyle), 'star0')
    draw(svg, rc.circle(CHAR_X_END - 30, CHAR_Y - 119, 15, starStyle), 'star1')
    draw(svg, rc.circle(CHAR_X_END - 30, CHAR_Y - 89, 15, starStyle), 'star2')

    // Ground
    draw(svg, rc.line(0, GROUND_Y, WIDTH, GROUND_Y, { roughness: 1, strokeWidth: 2 }), 'ground')

    // --- Choreography ---

    const charParts = '#head, #torso, #leg-l, #leg-r'

    // Walk: character slides in from left
    tl.add(charParts, { translateX: [100 - CHAR_X_END, 0], duration: 1000, ease: 'outBack(1.4)' }, 0)

    // Anvil fall: starts above viewport, lands on head
    tl.add('#anvil', { translateY: [-560, 0], duration: 830, ease: 'inQuad' }, 1000)
    tl.add('#anvil', { opacity: [0, 1], duration: 1 }, 1000)

    // Squash: character flattens
    tl.add(charParts, { scaleX: [1, 1.8], scaleY: [1, 0.3], duration: 500, ease: 'outElastic(1.5, 0.4)' }, 2000)
    tl.add(charParts, { transformOrigin: ['50% 100%'] }, 2000)

    // Stars: fade in and orbit
    const starIds = '#star0, #star1, #star2'
    tl.add(starIds, { opacity: [0, 1], duration: 200 }, 3000)
    tl.add('#star0', { translateX: [0, 60, 0, -60, 0], translateY: [0, -30, 0, 30, 0], duration: 1000, ease: 'linear' }, 3000)
    tl.add('#star1', { translateX: [0, -52, 0, 52, 0], translateY: [0, 30, 0, -30, 0], duration: 1000, ease: 'linear' }, 3000)
    tl.add('#star2', { translateX: [0, 52, 0, -52, 0], translateY: [0, -30, 0, 30, 0], duration: 1000, ease: 'linear' }, 3000)
  }, []))

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ background: '#fff', width: '100%', height: '100%' }}
    />
  )
}
