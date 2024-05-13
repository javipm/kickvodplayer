import { useEffect, useState } from 'react'
import type { Video } from '..'
import VideoJsPlayer from './VideoJS'
import { secondsToHms } from '@/utils/functions'

export default function Videos({
  streamer,
  userIsLogged,
  videoId,
}: {
  streamer: string
  userIsLogged: boolean
  videoId?: number
}) {
  const [videos, setVideos] = useState<Video[]>([])
  const [uri, setUri] = useState<string>('')
  const [videoUuid, setVideoUuid] = useState<string>('')
  const [poster, setPoster] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  const [allProgress, setAllProgress] = useState<Array<any>>([])
  const [progress, setProgress] = useState<number>(0)

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    poster: poster,
    enableSmoothSeeking: true,
    liveui: true,
    preload: 'auto',
    sources: [
      {
        src: uri,
      },
    ],
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

  const fetchVideos = async () => {
    try {
      const response = await fetch(
        `https://kick.com/api/v1/channels/${streamer}`
      )
      if (!response.ok) throw new Error('Failed to fetch videos')
      const data = await response.json()
      setVideos(data.previous_livestreams)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async () => {
    if (!userIsLogged) return
    try {
      const response = await fetch(`/api/progress/streamer`)
      const data = await response.json()
      setAllProgress(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setVideos([])
    setUri('')
    setLoading(true)

    const getVideos = setTimeout(() => {
      fetchVideos()
      fetchProgress()
    }, 1000)

    return () => clearTimeout(getVideos)
  }, [streamer])

  useEffect(() => {
    if (videoId) {
      getVideo(videoId)
    }
  }, [videoId, videos])

  const getVideo = async (id: number) => {
    const video: Video | undefined = videos.find(
      (video: Video) => video.id === id
    )

    if (!video) {
      return
    }

    try {
      const response = await fetch(
        `https://kick.com/api/v1/video/${video.video.uuid}`
      )
      const data = await response.json()
      const source = data.source
      setUri(source)
      setPoster(video.thumbnail.src)
      setVideoUuid(video.video.uuid)

      //Add uuid video to url path
      window.history.pushState({}, '', `/streamer/${streamer}/${video.id}`)

      const progress = allProgress.find(
        (item: any) => item.videoId === video.video.uuid
      )?.progress
      setProgress(progress || 0)
    } catch (error) {
      console.error(error)
    }
  }

  const renderVideo = (video: any) => {
    const progressVideo = allProgress.find(
      (item: any) => item.videoId === video.video.uuid
    )?.progress

    const duration = video.duration
    const progressPercentage = progressVideo
      ? (progressVideo / duration) * 100
      : 0

    return (
      <article
        key={video.id}
        data-video-id={video.id}
        className='cursor-pointer'
      >
        <div className='relative' onClick={() => getVideo(video.id)}>
          <div className='aspect-video overflow-hidden'>
            <img
              src={video.thumbnail.src}
              alt={video.session_title}
              className='object-cover'
            />
          </div>
          <div
            className='absolute bottom-0 left-0 h-1 w-full bg-green-500'
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <span className='absolute text-white bg-green-500 top-0 p-1 text-sm'>
            {secondsToHms(video.duration)}
          </span>
        </div>
        <h3 className='text-white text-center font-bold mt-2'>
          {video.session_title}
        </h3>
      </article>
    )
  }

  return videos && videos.length > 0 ? (
    <section>
      {uri ? (
        <div className='grid pt-10 lg:pt-10 place-items-center'>
          <VideoJsPlayer
            source={uri}
            options={videoJsOptions}
            videoUuid={videoUuid}
            userIsLogged={userIsLogged}
            progress={progress}
          />
        </div>
      ) : null}
      <h2 className='text-green-500 text-center text-3xl font-bold my-10'>
        List of VODs from {streamer}
      </h2>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 '>
        {videos.map(renderVideo)}
      </div>
    </section>
  ) : loading ? (
    <div className='text-white pt-10 text-xl font-bold'>Loading...</div>
  ) : (
    <div className='text-white pt-10 text-xl font-bold'>No videos found</div>
  )
}
