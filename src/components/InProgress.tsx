import VideoElement from '@/components/Video'
import SectionHeading from '@/components/SectionHeading'
import { useEffect, useState } from 'react'
import type { VideoProgress, Recent } from '..'
import { getKickVideo, getProgresses } from '@/lib/api'

export default function InProgress() {
  const [videos, setVideos] = useState<Recent[] | null>(null)

  useEffect(() => {
    const fetchRecentsAndVideos = async () => {
      try {
        const response = await getProgresses(6)
        if (!response) {
          setVideos([])
          return
        }

        const promises = response.map((video) => getVideoData(video))
        const results = await Promise.allSettled(promises)
        const newVideos = results
          .filter(
            (result) =>
              result.status === 'fulfilled' && result.value !== undefined
          )
          .map(
            (result) =>
              (result as unknown as PromiseFulfilledResult<Recent>).value
          )
        setVideos(newVideos)
      } catch (error) {
        console.error(error)
        setVideos([])
      }
    }

    fetchRecentsAndVideos()
  }, [])

  const getVideoData = async (video: VideoProgress) => {
    try {
      const data = await getKickVideo(video.videoId)
      if (!data) return
      const { source, livestream, live_stream_id, created_at } = data
      const { session_title, duration, thumbnail, channel } = livestream!
      const { user, slug } = channel!
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

  const getVideo = (streamer: string, videoId: number) => {
    window.location.href = `/streamer/${streamer}/${videoId}`
  }

  if (videos === null) {
    return (
      <section>
        <SectionHeading
          eyebrow='Pick up where you left off'
          title='Continue watching'
        />
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className='skeleton aspect-video rounded-md' />
              <div className='skeleton mt-2.5 h-4 w-3/4 rounded' />
              <div className='skeleton mt-1.5 h-3 w-1/3 rounded' />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (videos.length === 0) return null

  return (
    <section>
      <SectionHeading
        eyebrow='Pick up where you left off'
        title='Continue watching'
      />
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        {videos.map((video) => (
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
}
