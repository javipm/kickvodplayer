import { secondsToHms } from '@/utils/functions'
import { useEffect, useState } from 'react'

export default function InProgress() {
  const [recents, setRecents] = useState([])
  const [videos, setVideos] = useState([])

  useEffect(() => {
    try {
      fetch(`/api/progress/recent`)
        .then((res) => res.json())
        .then((data) => {
          setRecents(data)
        })
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    recents.map((video: any) => {
      getVideoData(video).then((data) => {
        setVideos([...videos, data])
      })
    })
  }, [recents])

  const getVideoData = async (video: any) => {
    try {
      const response = await fetch(
        `https://kick.com/api/v1/video/${video.videoId}`
      )
      const data = await response.json()
      const { source, livestream, live_stream_id } = data
      const { session_title, duration, thumbnail, channel } = livestream
      const { user, slug } = channel
      const { username } = user

      return {
        id: live_stream_id,
        uuid: video.videoId,
        title: session_title,
        duration,
        thumbnail,
        streamer: username,
        streamerSlug: slug,
        progress: video.progress,
        source,
      }
    } catch (error) {
      console.error(error)
    }
  }

  const goToVideo = (streamer: string, videoId: string) => {
    window.location.href = `/streamer/${streamer}/${videoId}`
  }

  const renderVideo = ({
    id,
    streamerSlug,
    thumbnail,
    title,
    progress,
    duration,
    streamer,
  }: any) => {
    const progressPercentage = progress ? (progress / duration) * 100 : 0

    return (
      <article key={id} data-video-id={id} className='cursor-pointer'>
        <div
          className='relative'
          onClick={() => {
            goToVideo(streamerSlug, id)
          }}
        >
          <div className='aspect-video overflow-hidden'>
            <img src={thumbnail} alt={title} className='object-cover' />
          </div>
          <div
            className='absolute bottom-0 left-0 h-1 w-full bg-green-500'
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <span className='absolute text-white bg-green-500 top-0 p-1 text-sm'>
            {secondsToHms(duration)}
          </span>
        </div>
        <h3 className='text-white text-center font-bold mt-2'>
          {streamer} - {title}
        </h3>
      </article>
    )
  }
  return (
    videos &&
    videos.length > 0 && (
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 '>
        {videos.map(renderVideo)}
      </div>
    )
  )
}
