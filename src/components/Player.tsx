import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { createPlayer, videoFeatures } from '@videojs/react'
import { VideoSkin } from '@videojs/react/video'
import { HlsJsVideo } from '@videojs/react/media/hlsjs-video'
import '@videojs/react/video/skin.css'
import { saveProgress } from '@/lib/api'

const PROGRESS_INTERVAL_SECONDS = 60

const Player = createPlayer({ features: videoFeatures })

function OrientationLock() {
  const fullscreen = Player.usePlayer((state) => state.fullscreen)

  useEffect(() => {
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (orientation: string) => Promise<void>
    }
    if (!orientation?.lock) return

    if (fullscreen) {
      orientation.lock('landscape').catch(() => {})
    } else {
      orientation.unlock?.()
    }
  }, [fullscreen])

  return null
}

function ProgressTracker(props: {
  videoRef: React.RefObject<HTMLVideoElement | null>
  userIsLogged: boolean
  videoUuid: string
}) {
  const { videoRef, userIsLogged, videoUuid } = props
  const paused = Player.usePlayer((state) => state.paused)

  useEffect(() => {
    if (!userIsLogged) return
    const video = videoRef.current
    if (!video) return

    const updateProgressVideo = () => {
      saveProgress(videoUuid, video.currentTime * 1000)
    }

    updateProgressVideo()
    if (paused) return

    const intervalId = setInterval(
      updateProgressVideo,
      PROGRESS_INTERVAL_SECONDS * 1000
    )
    return () => clearInterval(intervalId)
  }, [paused, userIsLogged, videoUuid, videoRef])

  return null
}

export default function VideoJS(props: {
  source: string
  poster: string
  videoUuid: string
  userIsLogged: boolean
  progress: number
}) {
  const { videoUuid, poster, userIsLogged, progress, source } = props
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !progress) return

    const setInitialTime = () => {
      video.currentTime = progress / 1000
    }
    video.addEventListener('loadedmetadata', setInitialTime, { once: true })
    return () => video.removeEventListener('loadedmetadata', setInitialTime)
  }, [source, progress])

  return (
    <Player.Provider>
      <VideoSkin
        poster={poster}
        className='w-full aspect-video'
        style={{ '--media-border-radius': '0px' } as CSSProperties}
      >
        <HlsJsVideo ref={videoRef} src={source} autoPlay />
      </VideoSkin>
      <ProgressTracker
        videoRef={videoRef}
        userIsLogged={userIsLogged}
        videoUuid={videoUuid}
      />
      <OrientationLock />
    </Player.Provider>
  )
}
