import { Player } from '@remotion/player'
import { SVGAttributes } from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

const ASPECT_RATIO = 16 / 9
const WIDTH = 800
const HEIGHT = Math.round(WIDTH / ASPECT_RATIO)

function rect(w: number, h: number, attrs?: SVGAttributes<SVGRectElement>) {
    return <rect x={-w / 2} y={-h / 2} width={w} height={h} {...attrs} />
}

function Scene() {
    const frame = useCurrentFrame()
    const { fps } = useVideoConfig()
    // Think in seconds, convert at the boundary
    const sec = frame / fps
    const impactSec = 1.0
    const impact = Math.round(impactSec * fps)
    const pause = 8 // visible beat — audience reads the hit

    // --- RED: rushes in, shoves blue, steps back ---
    const redSlide = interpolate(sec, [0.15, impactSec], [-300, 50], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    const redBounce = frame >= impact + pause
        ? spring({ frame: frame - impact - pause, fps, from: 0, to: -40, durationInFrames: 25 })
        : 0
    const redX = redSlide + redBounce

    // Still for 0.15s, then leans into the run
    const redRotate = sec < 0.15 ? 0
        : sec < impactSec ? interpolate(sec, [0.15, 0.4], [0, 10], { extrapolateRight: 'clamp' })
        : frame < impact + pause ? 10
        : spring({ frame: frame - impact - pause, fps, from: 10, to: 0, durationInFrames: 15 })

    // Speed lines near feet, fade in during the run
    const showSpeedLines = sec >= 0.2 && frame < impact
    const speedLineOpacity = showSpeedLines ? interpolate(sec, [0.2, impactSec], [0, 0.6], { extrapolateRight: 'clamp' }) : 0

    // --- BLUE: gets shoved, stumbles back, wobbles ---
    // Slides back and screeches to a stop — high damping, no wobble
    const blueSlide = frame >= impact + pause
        ? spring({ frame: frame - impact - pause, fps, from: 0, to: 100, config: { mass: 1, damping: 30 } })
        : 0
    const blueX = 100 + blueSlide

    // Tips backward AFTER pause (not during), then settles
    const blueRotate = frame >= impact + pause
        ? spring({ frame: frame - impact - pause, fps, from: 0, to: 15, config: { mass: 1.2, damping: 8 } })
        : 0

    // Blue speed lines — appear as it stumbles backward
    const showBlueLines = frame >= impact + pause && blueSlide > 5
    const blueLineOpacity = showBlueLines ? interpolate(blueSlide, [5, 50, 100], [0, 0.5, 0], { extrapolateRight: 'clamp' }) : 0

    // --- SQUASH: compress horizontally, stretch vertically at contact ---
    const squashX = frame >= impact && frame < impact + pause ? 0.6
        : frame >= impact + pause
            ? spring({ frame: frame - impact - pause, fps, from: 0.6, to: 1, config: { mass: 0.4, damping: 10 } })
            : 1
    const squashY = frame >= impact && frame < impact + pause ? 1.3
        : frame >= impact + pause
            ? spring({ frame: frame - impact - pause, fps, from: 1.3, to: 1, config: { mass: 0.4, damping: 10 } })
            : 1

    return (
        <svg viewBox="-400 -225 800 450" style={{ background: '#c8d0d8', width: '100%', height: '100%' }}>
            {showSpeedLines && <>
                <line x1={redX - 30} y1={15} x2={redX - 80} y2={15} stroke="#f87171" strokeWidth={2} opacity={speedLineOpacity} />
                <line x1={redX - 30} y1={22} x2={redX - 100} y2={22} stroke="#f87171" strokeWidth={2} opacity={speedLineOpacity} />
                <line x1={redX - 30} y1={29} x2={redX - 65} y2={29} stroke="#f87171" strokeWidth={2} opacity={speedLineOpacity} />
            </>}
            {rect(50, 50, { fill: '#f87171', style: { translate: `${redX}px 0`, rotate: `${redRotate}deg`, scale: `${squashX} ${squashY}` } })}
            {rect(50, 50, { fill: '#60a5fa', style: { translate: `${blueX}px 0`, rotate: `${blueRotate}deg`, scale: `${squashX} ${squashY}` } })}
            {showBlueLines && <>
                <line x1={blueX + 30} y1={15} x2={blueX + 70} y2={15} stroke="#60a5fa" strokeWidth={2} opacity={blueLineOpacity} />
                <line x1={blueX + 30} y1={22} x2={blueX + 85} y2={22} stroke="#60a5fa" strokeWidth={2} opacity={blueLineOpacity} />
                <line x1={blueX + 30} y1={29} x2={blueX + 60} y2={29} stroke="#60a5fa" strokeWidth={2} opacity={blueLineOpacity} />
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
