import { useEffect, useRef, useCallback } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'jb-videojs-hls-quality-selector'
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css'
import 'videojs-mobile-ui'
import 'videojs-hotkeys'
import type PlayerType from 'video.js/dist/types/player'
import { saveProgress } from '@/lib/api'

type Player = PlayerType & {
  hlsQualitySelector?: any
  mobileUi?: any
}

const PROGRESS_INTERVAL_SECONDS = 60

export default function VideoJS(props: {
  source: string
  poster: string
  videoUuid: string
  userIsLogged: boolean
  progress: number
  onReady?: any
}) {
  const videoRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<Player | null>(null)

  const { onReady, videoUuid, poster, userIsLogged, progress, source } = props

  const onReadyCallback = useCallback(onReady, [])

  const defaultOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    enableSmoothSeeking: true,
    liveui: true,
    preload: 'auto',
    plugins: {
      hotkeys: {
        volumeStep: 0.1,
        seekStep: 30,
      },
    },
    controlBar: {
      skipButtons: {
        forward: 10,
        backward: 10,
      },
    },
  }

  useEffect(() => {
    const options = {
      ...defaultOptions,
      sources: [
        {
          src: source,
        },
      ],
      poster: poster,
    }

    const player = playerRef.current

    if (!player) {
      const videoElement = document.createElement('video-js')

      videoElement.classList.add('vjs-big-play-centered')
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement)
      }

      playerRef.current = videojs(videoElement, options, () => {
        onReadyCallback && onReadyCallback(player)
      })
    } else {
      player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [source, videoRef, onReadyCallback])

  useEffect(() => {
    const player = playerRef.current

    if (player) {
      player.hlsQualitySelector({ displayCurrentQuality: true })
      player.mobileUi({
        fullscreen: {
          enterOnRotate: true,
          exitOnRotate: true,
          lockOnRotate: true,
          lockToLandscapeOnEnter: true,
        },
      })

      if (progress) {
        player.currentTime(progress / 1000)
      }
    }
  }, [playerRef, progress])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const player = playerRef.current

    if (player) {
      const updateProgressVideo = () => {
        if (!userIsLogged) return

        const progress = (player?.currentTime() ?? 0) * 1000
        saveProgress(videoUuid, progress)
      }

      player.on('play', () => {
        updateProgressVideo()
        intervalId = setInterval(() => {
          updateProgressVideo()
        }, PROGRESS_INTERVAL_SECONDS * 1000)
      })

      player.on('pause', () => {
        updateProgressVideo()
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
      })
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef, userIsLogged, videoUuid])

  return (
    <div data-vjs-player className='h-auto w-full'>
      <div ref={videoRef} />
    </div>
  )
}
