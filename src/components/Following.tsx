import { getFollows, getKickUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import type { User } from '..'
import SectionHeading from '@/components/SectionHeading'

export default function Following() {
  const [streamers, setStreamers] = useState<User[] | null>(null)

  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const follows = await getFollows()
        if (!follows) {
          setStreamers([])
          return
        }
        const promises = follows.map((follow) => getKickUser(follow.streamer))
        const newStreamers = (await Promise.all(promises)) as User[]
        setStreamers(newStreamers.filter(Boolean))
      } catch (error) {
        console.error(error)
        setStreamers([])
      }
    }

    fetchFollows()
  }, [])

  if (streamers === null) {
    return (
      <section>
        <SectionHeading eyebrow='Your circle' title='Following' />
        <div className='flex gap-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='skeleton h-16 w-16 shrink-0 rounded-full' />
          ))}
        </div>
      </section>
    )
  }

  if (streamers.length === 0) return null

  return (
    <section>
      <SectionHeading eyebrow='Your circle' title='Following' />
      <ul className='scroll-fade -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-scroll px-1 pb-3 hide-scrollbar'>
        {streamers.map((streamer) => (
          <li key={streamer.id} className='snap-start'>
            <a
              href={`/streamer/${streamer.username.toLowerCase()}`}
              className='group flex flex-col items-center gap-1.5'
            >
              <span className='rounded-full bg-gradient-to-tr from-signal to-ink-raised p-[2px] transition group-hover:from-white'>
                <img
                  src={streamer.profilepic}
                  alt=''
                  className='h-16 w-16 rounded-full border-2 border-ink object-cover'
                />
              </span>
              <span className='max-w-[4.5rem] truncate font-mono text-[10px] text-white/60'>
                {streamer.username}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
