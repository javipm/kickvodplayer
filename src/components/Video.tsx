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
  isActive = false,
}: {
  id: number
  streamer?: string
  title: string
  date: string
  duration: number
  thumbnail: string
  progress: number
  getVideo: () => void
  isActive?: boolean
}) {
  const progressPercentage = calculateProgress(progress, duration)

  return (
    <article data-video-id={id} className='group'>
      <button
        type='button'
        onClick={getVideo}
        aria-label={`Play ${title}`}
        aria-current={isActive ? 'true' : undefined}
        className='relative block w-full overflow-hidden rounded-md border border-line/70 bg-ink-raised text-left transition hover:border-white/30'
      >
        <div className='relative aspect-video overflow-hidden bg-ink'>
          <img
            src={thumbnail}
            alt=''
            loading='lazy'
            className='h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]'
          />

          {/* viewfinder corner brackets, revealed on hover/focus */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-2 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100'
          >
            <span className='absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-signal' />
            <span className='absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-signal' />
            <span className='absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-signal' />
            <span className='absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-signal' />
          </div>

          <span className='pointer-events-none absolute left-2 top-2 rounded-sm bg-ink/80 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-white/80 backdrop-blur-sm'>
            {secondsToHms(duration)}
          </span>

          {isActive && (
            <span className='pointer-events-none absolute right-2 top-2 flex items-center gap-1.5 rounded-full bg-signal/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-signal'>
              <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-signal' />
              Playing
            </span>
          )}

          {progressPercentage > 2 && (
            <progress
              className='progress-bar absolute inset-x-0 bottom-0 h-1 w-full'
              value={progressPercentage}
              max={100}
              aria-label={`Watched ${Math.round(progressPercentage)}% of ${title}`}
            />
          )}
        </div>
      </button>

      <h3 className='mt-2.5 line-clamp-2 text-sm font-medium text-white/90'>
        {streamer && <span className='text-white/50'>{streamer} · </span>}
        {title}
      </h3>
      <p className='mt-1 font-mono text-[11px] text-white/40'>{date}</p>
    </article>
  )
}
