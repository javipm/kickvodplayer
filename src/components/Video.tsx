import { calculateProgress, secondsToHms } from '@/lib/utils'

export default function Video({
  id,
  thumbnail,
  title,
  streamer,
  duration,
  progress,
  getVideo,
}: {
  id: number
  thumbnail: string
  title: string
  streamer?: string
  duration: number
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
        <div
          className='absolute bottom-0 left-0 h-1 w-full bg-green-500'
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <span className='absolute text-white bg-black bg-opacity-60 backdrop-blur-sm top-1 left-1 p-1 text-xs'>
          {secondsToHms(duration)}
        </span>
      </div>
      <h3 className='text-white text-center font-bold mt-2'>
        {streamer && streamer + ' - '}
        {title}
      </h3>
    </article>
  )
}
