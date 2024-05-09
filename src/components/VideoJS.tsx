import { useEffect, useRef, useCallback } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'jb-videojs-hls-quality-selector'
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css'
import 'videojs-mobile-ui'
import 'videojs-hotkeys'
import type PlayerType from 'video.js/dist/types/player'

type Player = PlayerType & {
  hlsQualitySelector?: any
  mobileUi?: any
}

const PROGRESS_INTERVAL_SECONDS = 60

export default function VideoJS(props: {
  source: any
  options: any
  videoUuid: string
  userIsLogged: boolean
  progress: number
  onReady?: any
}) {
  const videoRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<Player | null>(null)

  const { options, onReady, videoUuid, userIsLogged, progress } = props

  const onReadyCallback = useCallback(onReady, [])

  useEffect(() => {
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
  }, [options, videoRef, onReadyCallback])

  useEffect(() => {
    const player = playerRef.current

    if (player) {
      player.hlsQualitySelector({ displayCurrentQuality: true })
      player.mobileUi()

      if (progress) {
        player.currentTime(progress / 1000)
      }
    }
  }, [playerRef, progress])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const player = playerRef.current

    if (player) {
      const saveProgress = () => {
        if (!userIsLogged) return

        console.log('Saving progress...')

        const progress = (player?.currentTime() ?? 0) * 1000
        fetch(`/api/progress/${videoUuid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            progress,
          }),
        })
      }

      player.on('play', () => {
        saveProgress()
        intervalId = setInterval(() => {
          saveProgress()
        }, PROGRESS_INTERVAL_SECONDS * 1000)
      })

      player.on('pause', () => {
        saveProgress()
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
    <div data-vjs-player className='h-auto w-full lg:w-2/3'>
      <div ref={videoRef} />
    </div>
  )
}
