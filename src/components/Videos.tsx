import { useEffect, useState } from 'react'
import type { Video } from '..'
import VideoJsPlayer from './VideoJS'

export default function Videos({
  streamer,
  userIsLogged,
}: {
  streamer: string
  userIsLogged: boolean
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
  }

  useEffect(() => {
    const getVideos = setTimeout(() => {
      setLoading(true)
      fetch(`https://kick.com/api/v1/channels/${streamer}`)
        .then((response) => response.json())
        .then((data) => {
          setVideos(data.previous_livestreams)
          setLoading(false)
        })

      if (userIsLogged) {
        fetch(`/api/progress/get`)
          .then((response) => response.json())
          .then((data) => {
            setAllProgress(data)
          })
      }
    }, 1000)

    return () => clearTimeout(getVideos)
  }, [streamer])

  const getVideo = (id: number) => {
    const video: Video | undefined = videos.find(
      (video: Video) => video.id === id
    )

    if (!video) {
      return
    }

    fetch(`https://kick.com/api/v1/video/${video.video.uuid}`)
      .then((response) => response.json())
      .then((data) => {
        const source = data.source
        setUri(source)
        setPoster(video.thumbnail.src)
        setVideoUuid(video.video.uuid)

        const progress = allProgress.find(
          (item: any) => item.videoId === video.video.uuid
        )?.progress
        setProgress(progress || 0)
      })
  }

  const secondsToHms = (d: number) => {
    d = Number(d) / 1000
    var h = Math.floor(d / 3600)
    var m = Math.floor((d % 3600) / 60)
    var s = Math.floor((d % 3600) % 60)

    var hDisplay = h > 0 ? (h < 10 ? '0' + h : h) + ':' : '00:'
    var mDisplay = m > 0 ? (m < 10 ? '0' + m : m) + ':' : '00:'
    var sDisplay = s > 0 ? (s < 10 ? '0' + s : s) : '00'
    return hDisplay + mDisplay + sDisplay
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
        {(videos as Array<Video>).map((video: any) => {
          const progressVideo = allProgress.find(
            (item: any) => item.videoId === video.video.uuid
          )?.progress

          const duration = video.duration
          let progressPercentage = 0

          if (progressVideo)
            progressPercentage = (progressVideo / duration) * 100
          return (
            <article key={video.id} className='cursor-pointer'>
              <div className='relative' onClick={() => getVideo(video.id)}>
                <img
                  src={video.thumbnail.src}
                  alt={video.session_title}
                  className='aspect-video object-cover'
                />
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
        })}
      </div>
    </section>
  ) : loading ? (
    <div>Loading...</div>
  ) : (
    <div>No videos found</div>
  )
}
