import { useEffect, useRef, useState } from 'react'
import VideoElement from '@/components/Video'
import SectionHeading from '@/components/SectionHeading'
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
import Heart from './icons/Heart'
import { showToast } from '@/lib/toast'

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
  const [notFound, setNotFound] = useState<boolean>(false)
  const [streamerInfo, setStreamerInfo] = useState<StreamerInfo>()
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [followLoading, setFollowLoading] = useState<boolean>(false)

  const [allProgress, setAllProgress] = useState<Array<VideoProgress>>([])
  const [progress, setProgress] = useState<number>(0)

  const gridRef = useRef<HTMLDivElement | null>(null)

  const fetchData = async () => {
    try {
      const [streamerData, progressData] = await Promise.allSettled([
        getKickStreamer(streamer),
        userIsLogged ? getProgresses() : Promise.resolve(null),
      ])

      if (streamerData.status === 'fulfilled' && streamerData.value) {
        setStreamerInfo({
          id: streamerData.value.id,
          name: streamerData.value.user?.username,
          profile_image_url: streamerData.value.user?.profile_pic,
          banner_image_url: streamerData.value.banner_image?.url,
        })

        setVideos(streamerData.value.previous_livestreams)
      } else {
        setNotFound(true)
      }

      if (progressData.status === 'fulfilled' && progressData.value) {
        setAllProgress(progressData.value)
      }
    } catch (error) {
      console.error(error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setVideos([])
    setUri('')
    setNotFound(false)
    setLoading(true)

    fetchData()

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
        (item) => item.videoId === video.video.uuid
      )?.progress
      setProgress(progress || 0)

      //Scroll to top
      window.scrollTo(0, 0)
    } catch (error) {
      console.error(error)
      showToast('Could not load that video. Try again.', 'error')
    }
  }

  const closeVideo = () => {
    setUri('')
    setVideoUuid('')
    setPoster('')
    setProgress(0)
    window.history.pushState({}, '', `/streamer/${streamer}`)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const renderVideo = (video: Livestream) => {
    const progressVideo = allProgress.find(
      (item) => item.videoId === video.video.uuid
    )?.progress

    return (
      <VideoElement
        key={video.id}
        id={video.id}
        date={new Date(video.created_at).toLocaleString()}
        title={video.session_title}
        thumbnail={video.thumbnail.src}
        duration={video.duration}
        progress={progressVideo ?? 0}
        isActive={videoUuid === video.video.uuid}
        getVideo={() => getVideo(video.id)}
      />
    )
  }

  const toggleFollow = async () => {
    setFollowLoading(true)
    try {
      if (isFollowing) {
        const response = await setUnfollow(streamer)
        if (response) {
          setIsFollowing(false)
          showToast(`Unfollowed ${streamerInfo?.name ?? streamer}`, 'info')
        } else {
          showToast('Could not unfollow. Try again.', 'error')
        }
      } else {
        const response = await setFollow(streamer)
        if (response) {
          setIsFollowing(true)
          showToast(`Following ${streamerInfo?.name ?? streamer}`, 'success')
        } else {
          showToast('Could not follow. Try again.', 'error')
        }
      }
    } finally {
      setFollowLoading(false)
    }
  }

  return (
    <div key={streamer}>
      <nav
        aria-label='Breadcrumb'
        className='mx-auto flex max-w-screen-lg items-center gap-2 px-4 pt-4 font-mono text-[11px] uppercase tracking-wide text-white/40 sm:px-6'
      >
        <a href='/' className='transition hover:text-signal'>
          Home
        </a>
        <span aria-hidden='true'>/</span>
        <span className='truncate text-white/70'>
          {streamerInfo?.name ?? streamer}
        </span>
      </nav>

      {streamerInfo && streamerInfo.name && (
        <header className='relative mt-3 flex items-center'>
          <div className='relative w-full'>
            <img
              className='h-36 w-full object-cover md:h-64'
              src={streamerInfo?.banner_image_url}
              alt=''
            />
            <div className='absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent' />
            <div className='absolute inset-0 mx-auto flex max-w-screen-lg items-end justify-between px-4 pb-4 sm:items-center sm:pb-0 sm:px-6'>
              <div className='flex items-center gap-3 sm:gap-4'>
                <img
                  className='h-16 w-16 rounded-full border-2 border-signal object-cover sm:h-24 sm:w-24'
                  src={streamerInfo?.profile_image_url}
                  alt=''
                />
                <div>
                  <h1 className='font-display text-xl font-semibold text-white drop-shadow-sm sm:text-3xl'>
                    {streamerInfo?.name}
                  </h1>
                  {videos && videos.length > 0 && (
                    <p className='font-mono text-[11px] uppercase tracking-wide text-white/60'>
                      {videos.length} VODs archived
                    </p>
                  )}
                </div>
              </div>
              {userIsLogged && (
                <button
                  type='button'
                  aria-pressed={isFollowing}
                  disabled={followLoading}
                  className='flex items-center justify-center gap-2 rounded-sm bg-signal px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-4'
                  onClick={toggleFollow}
                >
                  {followLoading ? (
                    <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent' />
                  ) : (
                    <Heart className={isFollowing ? 'fill-current' : ''} />
                  )}
                  <span className='hidden sm:inline'>
                    {isFollowing ? 'Following' : 'Follow'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      <section className='mx-auto max-w-screen-lg px-4 sm:px-6'>
        {uri ? (
          <div className='mb-4 mt-6 lg:mb-10'>
            <button
              type='button'
              onClick={closeVideo}
              className='mb-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-white/50 transition hover:text-signal'
            >
              ← Back to {streamerInfo?.name ?? streamer}'s VODs
            </button>
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

      <section ref={gridRef} className='mx-auto max-w-screen-lg px-4 pt-6 sm:px-6'>
        {loading ? (
          <>
            <SectionHeading eyebrow='Archive' title='Latest VODs' />
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className='skeleton aspect-video rounded-md' />
                  <div className='skeleton mt-2.5 h-4 w-3/4 rounded' />
                  <div className='skeleton mt-1.5 h-3 w-1/3 rounded' />
                </div>
              ))}
            </div>
          </>
        ) : notFound ? (
          <div className='rounded-md border border-line/70 bg-ink-raised px-6 py-12 text-center'>
            <p className='font-mono text-xs uppercase tracking-wide text-rec'>
              Streamer not found
            </p>
            <p className='mt-2 text-sm text-white/60'>
              We couldn't reach Kick for "{streamer}". They may not exist, or
              Kick might be temporarily unavailable.
            </p>
            <a
              href='/'
              className='mt-5 inline-block rounded-sm bg-signal px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-ink transition hover:bg-white'
            >
              Back home
            </a>
          </div>
        ) : videos && videos.length > 0 ? (
          <>
            <SectionHeading
              eyebrow='Archive'
              title={`${streamerInfo?.name}'s latest VODs`}
            />
            <div className='flex gap-4 overflow-x-scroll pb-6 hide-scrollbar sm:grid sm:grid-cols-2 sm:overflow-auto lg:grid-cols-3'>
              {videos.map((video) => (
                <div key={video.id} className='w-80 shrink-0 sm:w-auto sm:shrink'>
                  {renderVideo(video)}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className='rounded-md border border-line/70 bg-ink-raised px-6 py-12 text-center'>
            <p className='font-mono text-xs uppercase tracking-wide text-white/50'>
              Nothing here yet
            </p>
            <p className='mt-2 text-sm text-white/60'>
              {streamerInfo?.name ?? streamer} doesn't have any VODs
              available right now.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
