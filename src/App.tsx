import { Player } from '@remotion/player'

function Scene() {
    return <div>Scene</div>
}

export default function App() {
    return (
        <Player
            component={Scene}
            durationInFrames={90} // total frames, must be integer > 0
            fps={30} // frame rate
            compositionWidth={800} // video width when rendered as MP4
            compositionHeight={450} // video height when rendered as MP4
            style={{ width: 800, height: 450 }} // CSS for the player container in browser
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
            // --- defaults ---
            initiallyShowControls={false} // show controls on initial render (or pass ms to auto-hide)
            numberOfSharedAudioTags={5} // pre-mounted audio tags for seamless playback
            inFrame={null} // limit playback start to after this frame
            outFrame={null} // limit playback end to before this frame
            showPosterWhenPaused={false} // show poster when paused
            showPosterWhenEnded={false} // show poster when ended
            showPosterWhenUnplayed={false} // show poster before first play
            showPosterWhenBuffering={false} // show poster when buffering + playing
            showPosterWhenBufferingAndPaused={false} // show poster when buffering + paused
            overflowVisible={false} // allow content to overflow player bounds
            bufferStateDelayInMilliseconds={300} // delay before showing buffering state
            noSuspense={false} // disable React Suspense wrapper
            logLevel="verbose" // logging verbosity
        />
    )
}
