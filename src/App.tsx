import { Player } from '@remotion/player'

function Scene() {
  return <div>Scene</div>
}

export default function App() {
  return (
    <Player
      component={Scene}
      durationInFrames={90}
      fps={30}
      compositionWidth={800}
      compositionHeight={450}
      controls={true}
      style={{ width: 800, height: 450 }}
      acknowledgeRemotionLicense={true}
      // --- defaults ---
      loop={false}
      autoPlay={false}
      clickToPlay={true}
      playbackRate={1}
      spaceKeyToPlayOrPause={true}
      moveToBeginningWhenEnded={true}
      allowFullscreen={true}
      doubleClickToFullscreen={false}
      showVolumeControls={true}
      initialFrame={0}
      initiallyShowControls={true}
      alwaysShowControls={false}
      showPlaybackRateControl={false}
      initiallyMuted={false}
      numberOfSharedAudioTags={5}
      inFrame={null}
      outFrame={null}
      showPosterWhenPaused={false}
      showPosterWhenEnded={false}
      showPosterWhenUnplayed={false}
      showPosterWhenBuffering={false}
      showPosterWhenBufferingAndPaused={false}
      hideControlsWhenPointerDoesntMove={true}
      overflowVisible={false}
      bufferStateDelayInMilliseconds={300}
      noSuspense={false}
      logLevel="info"
    />
  )
}
