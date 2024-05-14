import { useEffect, useState } from 'react'
import VideoElement from '@/components/Video'
import type { Video, StreamerInfo } from '..'
import VideoJsPlayer from './Player'
import { getProgresses, getKickStreamer, getKickVideo } from '@/lib/api'

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
  const [streamerInfo, setStreamerInfo] = useState<StreamerInfo>()

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
      const data = await getKickStreamer(streamer)
      if (data) {
        setStreamerInfo({
          id: data.id,
          name: data.user?.username,
          profile_image_url: data.user?.profile_pic,
          banner_image_url: data.banner_image?.url,
        })

        setVideos(data.previous_livestreams)
      }
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
      const data = await getKickVideo(video.video.uuid)
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

  return (
    <article>
      {streamerInfo && (
        <header className='my-10 flex items-center'>
          <div className='relative w-full'>
            <img
              className='w-full h-36 object-cover'
              src={streamerInfo?.banner_image_url}
              alt='banner'
            />
            <div className='absolute inset-0 flex items-center justify-between px-10'>
              <div className='flex items-center'>
                <img
                  className='w-24 h-24 rounded-full border-4 border-white mr-4'
                  src={streamerInfo?.profile_image_url}
                  alt='profile'
                />
                <h1 className='p-2 rounded text-green-500 text-2xl font-bold bg-black bg-opacity-60 backdrop-blur-sm'>
                  List of VODs from {streamerInfo?.name}
                </h1>
              </div>
              {/* <button
                className='py-2 px-4 rounded text-white font-bold bg-green-500 hover:bg-green-600'
                onClick={() => console.log('hola')}
              >
                ⭐️ Follow
              </button> */}
            </div>
          </div>
        </header>
      )}

      <section>
        {uri ? (
          <div className='grid mb-10 place-items-center'>
            <VideoJsPlayer
              source={uri}
              options={videoJsOptions}
              videoUuid={videoUuid}
              userIsLogged={userIsLogged}
              progress={progress}
            />
          </div>
        ) : null}
      </section>

      {videos && videos.length > 0 ? (
        <section>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 '>
            {videos.map((video: any) => renderVideo(video))}
          </div>
        </section>
      ) : loading ? (
        <div className='text-white pt-10 text-xl font-bold'>Loading...</div>
      ) : (
        <div className='text-white pt-10 text-xl font-bold'>
          No VODs or streamer found
        </div>
      )}
    </article>
  )
}
