import { calculateProgress, secondsToHms } from '@/lib/utils'

export default function Video({
  id,
  streamer,
  title,
  date,
  duration,
  thumbnail,
  progress,
  getVideo,
}: {
  id: number
  streamer?: string
  title: string
  date: string
  duration: number
  thumbnail: string
  progress: number
  getVideo: () => void
}) {
  const progressPercentage = calculateProgress(progress, duration)
  return (
    <article key={id} data-video-id={id} className='cursor-pointer'>
      <div className='relative' onClick={getVideo}>
        <div className='aspect-video overflow-hidden'>
          <img src={thumbnail} alt={title} className='object-cover' />
        </div>
        <span className='absolute text-white bg-black bg-opacity-60 backdrop-blur-sm top-1 left-1 p-1 text-xs'>
          {secondsToHms(duration)}
        </span>
        <span className='absolute text-white bg-black bg-opacity-60 backdrop-blur-sm bottom-2 left-1 p-1 text-xs'>
          {date}
        </span>
        <div
          className='absolute bottom-0 left-0 h-1 w-full bg-green-500'
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <h3 className='text-white text-center font-bold mt-2'>
        {streamer && streamer + ' - '}
        {title}
      </h3>
    </article>
  )
}
