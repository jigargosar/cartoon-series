# Rough.js Reference — Key Findings

## Seed Behavior (CRITICAL)
- **seed=0 is falsy** → falls back to `Math.random()` (non-deterministic). Always use seed >= 1.
- Same seed + same params = identical output
- Different seed = completely independent output (no "nearby" seeds)
- Internal: Linear Congruential Generator (multiplier 48271)

## Roughness Scaling
- Roughness does NOT scale with shape size uniformly
- Lines < 200px: full roughness (gain=1.0)
- Lines 200-500px: reduced roughness (interpolated)
- Lines > 500px: roughness × 0.4
- `maxRandomnessOffset` (default 2px) caps the pixel displacement

## Multi-Stroke (Double Drawing)
- Every shape is drawn TWICE by default (sketch overlay effect)
- Second stroke uses seed+1 via `cloneOptionsAlterSeed()`
- `disableMultiStroke: true` — draws once, halves visual variation + better perf

## Curve Quality
- `curveStepCount` (default 9) — points per curve, auto-scales for large shapes
- `curveFitting` (default 0.95) — 1.0 = perfect curves, 0.0 = max distortion

## Randomizer State Gotcha
- Reusing the SAME options object across calls shares randomizer state
- Always create fresh options objects per shape (our Sketch.opts() already does this)

## Fill Styles (7 types)
hachure (default), solid, zigzag, cross-hatch, dots, dashed, zigzag-line

## Performance for Animation
- `disableMultiStroke: true` — 50% fewer operations
- `preserveVertices: true` — no perf impact, stabilizes endpoints
- Pre-generate Drawables with seed, cache in React state
- Lower `curveStepCount` for faster rendering (trade quality)

## Dots fillStyle Bug (Issue #211)
- dots fill ignores seed — uses Math.random() always
- Avoid dots fill for deterministic animation
