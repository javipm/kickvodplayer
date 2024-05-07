import { useEffect, useState } from 'react'
import type { Video } from '..'
import ReactPlayer from 'react-player'

export default function VideosReactPlayer() {
  const [videos, setVideos] = useState([])
  const [player, setPlayer] = useState('')
  useEffect(() => {
    fetch('https://kick.com/api/v1/channels/andypsx')
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
        setPlayer(source)
      })
  }

  const handleProgress = (state) => {
    console.log('onProgress', state)
  }

  const secondsToHms = (d) => {
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
      {player ? (
        <ReactPlayer
          url={player}
          controls
          onProgress={handleProgress}
        ></ReactPlayer>
      ) : null}
      <div className='grid grid-cols-3 gap-4 p-10'>
        {(videos as Array<Video>).map((video: any) => {
          const progress = 50
          return (
            <article key={video.id}>
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
