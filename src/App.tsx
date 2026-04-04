import { useCallback, useRef, useState } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { SceneRenderer, type SceneData } from './interpreter'
import initialScene from './scene.json'

const ASPECT_RATIO = 16 / 9
const WIDTH = 800
const HEIGHT = Math.round(WIDTH / ASPECT_RATIO)
const FPS = 30

function getTotalFrames(data: SceneData) {
    const lastBeat = data.beats[data.beats.length - 1]
    return Math.ceil((lastBeat.t / 1000) * FPS) + 5
}

function Scene({ data }: { data: SceneData }) {
    return (
        <svg viewBox="-400 -225 800 450" style={{ background: '#c8d0d8', width: '100%', height: '100%' }}>
            <SceneRenderer data={data} />
        </svg>
    )
}

function useDrag(barRef: React.RefObject<HTMLDivElement | null>, totalMs: number, onDrag: (ms: number) => void) {
    const handleMove = useCallback((e: PointerEvent) => {
        const bar = barRef.current
        if (!bar) return
        const rect = bar.getBoundingClientRect()
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
        onDrag(Math.round(pct * totalMs))
    }, [barRef, totalMs, onDrag])

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        e.preventDefault()
        const target = e.currentTarget as HTMLElement
        target.setPointerCapture(e.pointerId)
        const move = (ev: PointerEvent) => handleMove(ev)
        const up = () => { target.removeEventListener('pointermove', move); target.removeEventListener('pointerup', up) }
        target.addEventListener('pointermove', move)
        target.addEventListener('pointerup', up)
        handleMove(e.nativeEvent)
    }, [handleMove])

    return onPointerDown
}

function SnapPoints({ startMs, endMs, totalMs, onChangeStart, onChangeEnd, onSeek }: {
    startMs: number; endMs: number; totalMs: number
    onChangeStart: (ms: number) => void; onChangeEnd: (ms: number) => void
    onSeek: (ms: number) => void
}) {
    const barRef = useRef<HTMLDivElement>(null)
    const dragStart = useDrag(barRef, totalMs, (ms) => { onChangeStart(ms); onSeek(ms) })
    const dragEnd = useDrag(barRef, totalMs, (ms) => { onChangeEnd(ms); onSeek(ms) })

    const dot = (leftPct: string, onDown: (e: React.PointerEvent) => void) => ({
        style: { position: 'absolute' as const, left: leftPct, top: '50%', transform: 'translate(-50%, -50%)', cursor: 'ew-resize', background: '#f87171', borderRadius: '50%', width: 14, height: 14, border: '2px solid #fff', touchAction: 'none' as const },
        onPointerDown: onDown,
    })

    return (
        <div ref={barRef} style={{ width: WIDTH, marginTop: 8, position: 'relative', height: 32, background: '#2a2a3a', borderRadius: 6, userSelect: 'none' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(startMs / totalMs) * 100}%`, width: `${((endMs - startMs) / totalMs) * 100}%`, background: '#f8717133', borderRadius: 4 }} />
            <div {...dot(`${(startMs / totalMs) * 100}%`, dragStart)} />
            <div {...dot(`${(endMs / totalMs) * 100}%`, dragEnd)} />
            <span style={{ position: 'absolute', left: `${(startMs / totalMs) * 100}%`, top: -16, transform: 'translateX(-50%)', fontFamily: 'monospace', fontSize: 10, color: '#aaa' }}>0° @{startMs}ms</span>
            <span style={{ position: 'absolute', left: `${(endMs / totalMs) * 100}%`, top: -16, transform: 'translateX(-50%)', fontFamily: 'monospace', fontSize: 10, color: '#aaa' }}>10° @{endMs}ms</span>
            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontFamily: 'monospace', fontSize: 10, color: '#666' }}>red.rotate</span>
        </div>
    )
}

export default function App() {
    const playerRef = useRef<PlayerRef>(null)
    const [rotateStart, setRotateStart] = useState(0)
    const [rotateEnd, setRotateEnd] = useState(400)
    const [sceneData, setSceneData] = useState<SceneData>(initialScene as SceneData)
    const SceneWithData = useCallback(() => <Scene data={sceneData} />, [sceneData])

    const totalMs = sceneData.beats[sceneData.beats.length - 1].t

    const seekTo = useCallback((ms: number) => {
        playerRef.current?.seekTo(Math.round((ms / 1000) * FPS))
        playerRef.current?.pause()
    }, [])

    const updateRotateTiming = useCallback((startMs: number, endMs: number) => {
        const next = structuredClone(sceneData)
        const beat1 = next.beats[1]
        const redBeat = beat1.red as Record<string, unknown>
        const rot = redBeat.rotate as { to: number; ease: string; startAt: number; endAt: number }
        rot.startAt = startMs
        rot.endAt = endMs
        setSceneData(next)
    }, [sceneData])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, minHeight: '100vh', background: '#1a1a2e' }}>
            <Player
                ref={playerRef}
                component={SceneWithData}
                durationInFrames={getTotalFrames(sceneData)}
                fps={FPS}
            compositionWidth={WIDTH} // how many pixels Scene has to draw in
            compositionHeight={HEIGHT} // how many pixels Scene has to draw in
            style={{ width: WIDTH, height: HEIGHT }} // how big the player appears on the webpage
            controls={true} // show seek bar + play/pause button
            acknowledgeRemotionLicense={true} // suppress license console warning
            loop={false} // restart when video ends
            clickToPlay={true} // single click to play/pause
            autoPlay={false} // start playing immediately on load
            spaceKeyToPlayOrPause={true} // space key toggles play/pause (requires controls)
            playbackRate={1} // speed multiplier (0.5 = half, 2 = double)
            moveToBeginningWhenEnded={true} // seek to frame 0 when ended (only when loop=false)
            allowFullscreen={true} // allow fullscreen mode
            doubleClickToFullscreen={true} // double click toggles fullscreen (adds 200ms click delay)
            showVolumeControls={true} // volume slider + mute button (requires controls)
            initialFrame={0} // start from this frame (immutable after mount)
            alwaysShowControls={false} // keep controls visible even when mouse leaves
            showPlaybackRateControl={true} // gear icon for speed (true = [0.5..3], or pass number[])
            initiallyMuted={false} // start muted
            hideControlsWhenPointerDoesntMove={true} // hide after 3s inactivity (or pass ms)
            logLevel="info" // logging verbosity
            initiallyShowControls={true} // show controls on initial render (or pass ms to auto-hide)
            // --- defaults ---
            numberOfSharedAudioTags={5} // pre-mounted audio tags for seamless playback
            inFrame={null} // limit playback start to after this frame
            outFrame={null} // limit playback end to before this frame
            overflowVisible={false} // allow content to overflow player bounds
            bufferStateDelayInMilliseconds={300} // delay before showing buffering state
            noSuspense={false} // disable React Suspense wrapper
            className={undefined} // HTML class for the player container
            browserMediaControlsBehavior={undefined} // interaction with browser media session API
            audioLatencyHint={undefined} // AudioContext latency category
            volumePersistenceKey={undefined} // localStorage key to persist volume across sessions
            // --- poster ---
            showPosterWhenPaused={true} // show poster when paused
            showPosterWhenEnded={false} // show poster when ended
            showPosterWhenUnplayed={false} // show poster before first play
            showPosterWhenBuffering={false} // show poster when buffering + playing
            showPosterWhenBufferingAndPaused={false} // show poster when buffering + paused
            renderPoster={undefined} // () => ReactNode — custom overlay for poster states
            posterFillMode={undefined} // how poster fills the player area
            // --- render overrides ---
            renderPlayPauseButton={undefined} // ({playing}) => ReactNode — custom play/pause button
            renderFullscreenButton={undefined} // ({isFullscreen}) => ReactNode — custom fullscreen button
            renderMuteButton={undefined} // ({muted}) => ReactNode — custom mute button
            renderVolumeSlider={undefined} // () => ReactNode — custom volume slider
            renderCustomControls={undefined} // () => ReactNode — extra controls alongside built-in ones
            renderLoading={undefined} // () => ReactNode — custom loading indicator
            errorFallback={undefined} // ({error}) => ReactNode — custom error display
        />
            <SnapPoints
                startMs={rotateStart} endMs={rotateEnd} totalMs={totalMs}
                onChangeStart={(ms) => { setRotateStart(ms); updateRotateTiming(ms, rotateEnd) }}
                onChangeEnd={(ms) => { setRotateEnd(ms); updateRotateTiming(rotateStart, ms) }}
                onSeek={seekTo}
            />
        </div>
    )
}
