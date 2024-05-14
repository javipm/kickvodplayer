import VideoElement from '@/components/Video'
import { useEffect, useState } from 'react'
import type { Recent } from '..'

export default function InProgress() {
  const [recents, setRecents] = useState([])
  const [videos, setVideos] = useState<Recent[]>([])

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
    recents.map((video: Recent) => {
      getVideoData(video).then((data) => {
        if (data) {
          setVideos([...videos, data])
        }
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

  const getVideo = (streamer: string, videoId: string) => {
    return (window.location.href = `/streamer/${streamer}/${videoId}`)
  }

  return (
    videos &&
    videos.length > 0 && (
      <section>
        <h2 className='mb-4 text-green-500 text-2xl font-bold'>
          Continue watching...
        </h2>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 '>
          {videos.map((video: any) => (
            <VideoElement
              key={video.id}
              id={video.id}
              thumbnail={video.thumbnail}
              streamer={video.streamer}
              title={video.title}
              duration={video.duration}
              progress={video.progress}
              getVideo={() => getVideo(video.streamerSlug, video.id)}
            />
          ))}
        </div>
      </section>
    )
  )
}
