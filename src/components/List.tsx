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
      <div className='relative'>
        {videoUuid == video.video.uuid && (
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10'>
            <span className='text-white text-lg font-bold animate-blink'>
              Playing now...
            </span>
          </div>
        )}
        <VideoElement
          key={video.id}
          id={video.id}
          thumbnail={video.thumbnail.src}
          title={video.session_title}
          duration={video.duration}
          progress={progressVideo}
          getVideo={() => getVideo(video.id)}
        />
      </div>
    )
  }

  return (
    <div>
      {streamerInfo && streamerInfo.name && (
        <header className='flex items-center mb-4'>
          <div className='relative w-full'>
            <img
              className='w-full h-36 md:h-64 object-cover'
              src={streamerInfo?.banner_image_url}
              alt='banner'
            />
            <div className='max-w-screen-lg mx-auto absolute inset-0 flex items-center justify-between'>
              <div className='flex items-center'>
                <img
                  className='w-24 h-24 rounded-full border-4 border-white mr-4'
                  src={streamerInfo?.profile_image_url}
                  alt='profile'
                />
                <span className='p-2 rounded text-white text-2xl font-bold bg-black bg-opacity-60 backdrop-blur-sm'>
                  {streamerInfo?.name}
                </span>
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

      <section className='max-w-screen-lg mx-auto'>
        {uri ? (
          <div className='grid mb-4 lg:mb-10 place-items-center'>
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

      <section className='max-w-screen-lg mx-auto px-2 md:px-0'>
        {videos && videos.length > 0 ? (
          <>
            <h2 className='mb-4 text-green-500 text-2xl font-bold'>
              {streamerInfo?.name}'s latest VODs
            </h2>
            <div className='flex gap-4 overflow-x-scroll md:overflow-auto pb-6 hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3'>
              {videos.map((video) => (
                <div className='inline-block'>
                  <article className='w-80 md:w-full'>
                    {renderVideo(video)}
                  </article>
                </div>
              ))}
            </div>
          </>
        ) : loading ? (
          <div className='flex justify-center items-center h-screen'>
            <div className='animate-spin h-10 w-10 border-t-2 border-b-2 border-white rounded-full'></div>
          </div>
        ) : (
          <div className='text-white pt-10 text-xl font-bold'>
            No VODs found
          </div>
        )}
      </section>
    </div>
  )
}

;<style jsx>{`
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>
