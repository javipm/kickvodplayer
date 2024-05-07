import { useEffect, useRef, useState } from 'react'
import type { Video } from '..'
import VideoJsPlayer from './VideoJS'

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [uri, setUri] = useState<string>('')
  const [poster, setPoster] = useState<string>('')

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
  }

  useEffect(() => {
    fetch('https://kick.com/api/v1/channels/ricoy')
      .then((response) => response.json())
      .then((data) => {
        console.log(data.previous_livestreams)
        setVideos(data.previous_livestreams)
      })
  }, [])

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
        console.log(data)

        const source = data.source
        setUri(source)
        setPoster(video.thumbnail.src)
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

  return (
    <section>
      {uri ? (
        <div className='grid p-10 place-items-center'>
          <VideoJsPlayer source={uri} options={videoJsOptions} />
        </div>
      ) : null}
      <div className='grid grid-cols-3 gap-4 p-10'>
        {(videos as Array<Video>).map((video: any) => {
          const progress = 50
          return (
            <article key={video.id} className='cursor-pointer'>
              <div className='relative' onClick={() => getVideo(video.id)}>
                <img src={video.thumbnail.src} alt={video.session_title} />
                <div
                  className='absolute bottom-0 left-0 h-2 w-full bg-red-400'
                  style={{ width: `${progress}%` }}
                ></div>
                <span className='absolute text-white bg-red-400 top-0 p-1 text-sm'>
                  {secondsToHms(video.duration)}
                </span>
              </div>
              <h3>{video.session_title}</h3>
            </article>
          )
        })}
      </div>
    </section>
  )
}
