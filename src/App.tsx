import { useCallback } from 'react'
import { Player } from '@remotion/player'
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

const sceneData = initialScene as SceneData

export default function App() {
    const SceneWithData = useCallback(() => <Scene data={sceneData} />, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, minHeight: '100vh', background: '#1a1a2e' }}>
            <Player
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
        </div>
    )
}
