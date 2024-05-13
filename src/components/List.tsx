import { useEffect, useState } from 'react'
import VideoElement from '@/components/Video'
import type { Video } from '..'
import VideoJsPlayer from './VideoJS'
import { getProgresses, getStreamer, geteVideo } from '@/lib/api'

export default function List({
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
      const data = await getStreamer(streamer)
      if (data) setVideos(data.previous_livestreams)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async () => {
    if (!userIsLogged) return
    try {
      const data = await getProgresses()
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
      const data = await geteVideo(video.video.uuid)
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

      //Scroll to top
      window.scrollTo(0, 0)
    } catch (error) {
      console.error(error)
    }
  }

  const renderVideo = (video: any) => {
    const progressVideo = allProgress.find(
      (item: any) => item.videoId === video.video.uuid
    )?.progress

    return (
      <VideoElement
        key={video.id}
        id={video.id}
        thumbnail={video.thumbnail.src}
        title={video.session_title}
        duration={video.duration}
        progress={progressVideo}
        getVideo={() => getVideo(video.id)}
      />
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
        {videos.map((video: any) => renderVideo(video))}
      </div>
    </section>
  ) : loading ? (
    <div className='text-white pt-10 text-xl font-bold'>Loading...</div>
  ) : (
    <div className='text-white pt-10 text-xl font-bold'>No videos found</div>
  )
}
