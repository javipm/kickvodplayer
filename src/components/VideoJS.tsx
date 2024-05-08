import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import qualitySelector from 'jb-videojs-hls-quality-selector'
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css'
import 'videojs-mobile-ui'
import 'videojs-hotkeys'
import 'videojs-seek-buttons'
import 'videojs-seek-buttons/dist/videojs-seek-buttons.css'
import type Player from 'video.js/dist/types/player'

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

  const saveProgress = () => {
    if (!userIsLogged) return

    console.log('Saving progress...')
    const player = playerRef.current

    const progress = player?.currentTime() * 1000
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

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js')

      videoElement.classList.add('vjs-big-play-centered')
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement)
      }

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player)
      }))
    } else {
      const player = playerRef.current

      player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [options, videoRef])

  useEffect(() => {
    const player = playerRef.current

    if (player) {
      player.hlsQualitySelector({ displayCurrentQuality: true })
      player.mobileUi({
        touchControls: {
          tapTimeout: 100,
        },
      })
      player.seekButtons({
        forward: 30,
        back: 10,
      })

      if (progress) {
        player.currentTime(progress / 1000)
      }
    }
  }, [playerRef])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const player = playerRef.current

    if (player) {
      player.on('play', () => {
        saveProgress()
        intervalId = setInterval(() => {
          saveProgress()
        }, PROGRESS_INTERVAL_SECONDS * 1000)
      })

      player.on('pause', () => {
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
  }, [playerRef])

  return (
    <div data-vjs-player className='h-auto w-full lg:w-2/3'>
      <div ref={videoRef} />
    </div>
  )
}
