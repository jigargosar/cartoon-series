import { Player } from '@remotion/player'
import { SVGAttributes } from 'react'
import { useCurrentFrame, useVideoConfig } from 'remotion'
import { createTimeline } from 'animejs'

const ASPECT_RATIO = 16 / 9
const WIDTH = 800
const HEIGHT = Math.round(WIDTH / ASPECT_RATIO)

function rect(w: number, h: number, attrs?: SVGAttributes<SVGRectElement>) {
    return <rect x={-w / 2} y={-h / 2} width={w} height={h} {...attrs} />
}

/*
function Scene_remotion() {
    // ... old remotion-only version preserved for comparison
    // See git history: dd3a258
}
*/

// --- anime.js version: choreography in one block ---

const red: Record<string, number> = {}
const blue: Record<string, number> = {}
const tl = createTimeline({ autoplay: false })

// Red: full journey per property using keyframes
tl.add(red, {
    x: [
        { to: -300, duration: 150 },           // still
        { to: 75, duration: 850, ease: 'inQuad' }, // rush to contact
        { to: 75, duration: 500 },              // hold at impact
        { to: 20, duration: 800, ease: 'outExpo' }, // slide back with friction
    ],
    rotate: [
        { to: 0, duration: 150 },              // still
        { to: 10, duration: 250, ease: 'outQuad' }, // lean forward
        { to: 10, duration: 600 },              // hold lean
        { to: 0, duration: 50 },                // straighten on impact
    ],
    squashX: [
        { to: 1, duration: 1000 },              // normal until impact
        { to: 0.65, duration: 80, ease: 'outQuad' }, // compress
        { to: 0.65, duration: 420 },             // hold
        { to: 1, duration: 400, ease: 'outElastic(1, 0.5)' }, // spring back
    ],
    squashY: [
        { to: 1, duration: 1000 },
        { to: 1.2, duration: 80, ease: 'outQuad' },
        { to: 1.5, duration: 420, ease: 'inOutQuad' }, // grow taller during pause
        { to: 1, duration: 400, ease: 'outElastic(1, 0.5)' },
    ],
    speedLines: [
        { to: 0, duration: 200 },
        { to: 0.6, duration: 600 },
        { to: 0, duration: 50 },                // vanish on impact
    ],
}, 0)

// Blue: full journey per property
tl.add(blue, {
    x: [
        { to: 100, duration: 1500 },            // stationary through impact+pause
        { to: 200, duration: 800, ease: 'outExpo' }, // shoved back, friction stop
    ],
    rotate: [
        { to: 0, duration: 1500 },
        { to: 12, duration: 400, ease: 'outQuad' }, // tip from shove
        { to: 0, duration: 600, ease: 'outElastic(1, 0.5)' }, // wobble upright
    ],
    squashX: [
        { to: 1, duration: 1000 },
        { to: 0.65, duration: 80, ease: 'outQuad' },
        { to: 0.65, duration: 420 },
        { to: 1, duration: 400, ease: 'outElastic(1, 0.5)' },
    ],
    squashY: [
        { to: 1, duration: 1000 },
        { to: 1.2, duration: 80, ease: 'outQuad' },
        { to: 1.5, duration: 420, ease: 'inOutQuad' },
        { to: 1, duration: 400, ease: 'outElastic(1, 0.5)' },
    ],
}, 0)

function Scene() {
    const frame = useCurrentFrame()
    const { fps } = useVideoConfig()
    tl.seek((frame / fps) * 1000)

    const showRedLines = (red.speedLines ?? 0) > 0.05 && (red.x ?? -300) < 50
    const showBlueLines = (blue.x ?? 100) > 110

    return (
        <svg viewBox="-400 -225 800 450" style={{ background: '#c8d0d8', width: '100%', height: '100%' }}>
            {showRedLines && <>
                <line x1={(red.x ?? 0) - 30} y1={15} x2={(red.x ?? 0) - 80} y2={15} stroke="#f87171" strokeWidth={2} opacity={red.speedLines ?? 0} />
                <line x1={(red.x ?? 0) - 30} y1={22} x2={(red.x ?? 0) - 100} y2={22} stroke="#f87171" strokeWidth={2} opacity={red.speedLines ?? 0} />
                <line x1={(red.x ?? 0) - 30} y1={29} x2={(red.x ?? 0) - 65} y2={29} stroke="#f87171" strokeWidth={2} opacity={red.speedLines ?? 0} />
            </>}
            {rect(50, 50, { fill: '#f87171', style: {
                translate: `${red.x ?? -300}px 0`,
                rotate: `${red.rotate ?? 0}deg`,
                scale: `${red.squashX ?? 1} ${red.squashY ?? 1}`,
            } })}
            {rect(50, 50, { fill: '#60a5fa', style: {
                translate: `${blue.x ?? 100}px 0`,
                rotate: `${blue.rotate ?? 0}deg`,
                scale: `${blue.squashX ?? 1} ${blue.squashY ?? 1}`,
            } })}
            {showBlueLines && <>
                <line x1={(blue.x ?? 100) + 30} y1={15} x2={(blue.x ?? 100) + 70} y2={15} stroke="#60a5fa" strokeWidth={2} opacity={0.4} />
                <line x1={(blue.x ?? 100) + 30} y1={22} x2={(blue.x ?? 100) + 85} y2={22} stroke="#60a5fa" strokeWidth={2} opacity={0.4} />
                <line x1={(blue.x ?? 100) + 30} y1={29} x2={(blue.x ?? 100) + 60} y2={29} stroke="#60a5fa" strokeWidth={2} opacity={0.4} />
            </>}
        </svg>
    )
}

export default function App() {
    return (
        <Player
            component={Scene}
            durationInFrames={90} // total frames, must be integer > 0
            fps={30} // frame rate
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
    )
}
