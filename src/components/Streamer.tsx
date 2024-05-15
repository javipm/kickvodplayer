import { useEffect, useState } from 'react'
import VideoElement from '@/components/Video'
import type { Livestream, StreamerInfo, VideoProgress } from '..'
import VideoJsPlayer from './Player'
import {
  getProgresses,
  getKickStreamer,
  getKickVideo,
  getIsFollowing,
  setUnfollow,
  setFollow,
} from '@/lib/api'
import PlayIcon from '@/components/icons/Play'
import Heart from './icons/Heart'

export default function Streamer({
  streamer,
  userIsLogged,
  videoId,
}: {
  streamer: string
  userIsLogged: boolean
  videoId?: number
}) {
  const [videos, setVideos] = useState<Livestream[]>([])
  const [uri, setUri] = useState<string>('')
  const [videoUuid, setVideoUuid] = useState<string>('')
  const [poster, setPoster] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [streamerInfo, setStreamerInfo] = useState<StreamerInfo>()
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  const [allProgress, setAllProgress] = useState<Array<VideoProgress>>([])
  const [progress, setProgress] = useState<number>(0)

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
      if (!data) return
      setAllProgress(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setVideos([])
    setUri('')
    setLoading(true)

    fetchVideos()
    fetchProgress()

    if (userIsLogged) {
      getIsFollowing(streamer).then((data) => {
        setIsFollowing(data)
      })
    }
  }, [streamer])

  useEffect(() => {
    if (videoId) {
      getVideo(videoId)
    }
  }, [videoId, videos])

  const getVideo = async (id: number) => {
    const video = videos.find((video) => video.id === id)

    if (!video) {
      return
    }

    try {
      const data = await getKickVideo(video.video.uuid)
      if (!data) return
      const source = data.source
      if (!source) return
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
      <div className='relative' key={video.id}>
        {videoUuid == video.video.uuid && (
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10'>
            <span className='text-white text-lg font-bold animate-blink'>
              <PlayIcon className='text-7xl opacity-80 -mt-4' />
            </span>
          </div>
        )}
        <VideoElement
          key={video.id}
          id={video.id}
          date={new Date(video.created_at).toLocaleString()}
          title={video.session_title}
          thumbnail={video.thumbnail.src}
          duration={video.duration}
          progress={progressVideo ?? 0}
          getVideo={() => getVideo(video.id)}
        />
      </div>
    )
  }

  const toggleFollow = async () => {
    if (isFollowing) {
      const response = await setUnfollow(streamer)
      if (response) setIsFollowing(false)
    } else {
      const response = await setFollow(streamer)
      if (response) setIsFollowing(true)
    }
  }

  return (
    <div key={streamer}>
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
              {userIsLogged && (
                <button
                  className='flex items-center justify-center gap-2 py-2 px-4 rounded text-white font-bold bg-green-500 hover:bg-green-700'
                  onClick={toggleFollow}
                >
                  {isFollowing ? (
                    <>
                      <Heart className='fill-current' />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <Heart />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      <section className='max-w-screen-lg mx-auto'>
        {uri ? (
          <div className='grid mb-4 lg:mb-10 place-items-center'>
            <VideoJsPlayer
              source={uri}
              poster={poster}
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
                <div key={video.id} className='inline-block'>
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
