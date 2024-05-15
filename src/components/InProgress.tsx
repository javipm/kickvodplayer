import VideoElement from '@/components/Video'
import { useEffect, useState } from 'react'
import type { Recent } from '..'
import { getKickVideo, getProgresses } from '@/lib/api'

export default function InProgress() {
  const [recents, setRecents] = useState([])
  const [videos, setVideos] = useState<Recent[]>([])

  const fetchRecents = async () => {
    try {
      const response = await getProgresses(6)
      setRecents(response)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchVideos = async () => {
    try {
      const promises = recents.map((video) => getVideoData(video))
      const newVideos = await Promise.all(promises)
      const filteredVideos = newVideos.filter(
        (video) => video !== undefined
      ) as Recent[]
      setVideos(filteredVideos)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchRecents()
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [recents])

  const getVideoData = async (video: any) => {
    try {
      const data = await getKickVideo(video.videoId)
      const { source, livestream, live_stream_id, created_at } = data
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
        date: new Date(created_at).toLocaleString(),
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getVideo = (streamer: string, videoId: string) => {
    return (window.location.href = `/streamer/${streamer}/${videoId}`)
  }

  return (
    videos &&
    videos.length > 0 && (
      <section>
        <h3 className='mb-4 text-green-500 text-2xl font-bold'>
          Continue watching...
        </h3>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 '>
          {videos.map((video: any) => (
            <VideoElement
              key={video.id}
              id={video.id}
              streamer={video.streamer}
              title={video.title}
              date={video.date}
              duration={video.duration}
              thumbnail={video.thumbnail}
              progress={video.progress}
              getVideo={() => getVideo(video.streamerSlug, video.id)}
            />
          ))}
        </div>
      </section>
    )
  )
}
