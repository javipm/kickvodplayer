import { getFollows, getKickUser } from '@/lib/api'
import { useEffect, useRef, useState } from 'react'
import type { UserKick } from '..'

export default function Following() {
  const listRef = useRef(null)

  const [streamers, setStreamers] = useState<UserKick[]>([])

  const fetchFollows = async () => {
    try {
      const follows = await getFollows()
      const promises = follows.map((follow: any) =>
        getKickUser(follow.streamer)
      )
      const newStreamers = await Promise.all(promises)
      setStreamers(newStreamers.filter(Boolean))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchFollows()
  }, [])

  return (
    streamers &&
    streamers.length > 0 && (
      <section>
        <h3 className='mb-4 text-green-500 text-2xl font-bold'>Following</h3>
        <ul
          ref={listRef}
          className='flex overflow-x-scroll space-x-3 whitespace-nowrap mb-4 pb-3'
        >
          {streamers.map((streamer: any) => (
            <li
              key={streamer.id}
              className='inline-block min-w-max cursor-pointer'
            >
              <div className='bg-gradient-to-tr from-green-500 to-green-900 p-1 rounded-full'>
                <a
                  className=' bg-white block rounded-full p-1 hover:-rotate-6 transform transition'
                  href={`/streamer/${streamer.username.toLowerCase()}`}
                >
                  <img
                    className='h-16 w-16 rounded-full'
                    src={streamer.profilepic}
                    alt={streamer.username}
                  />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    )
  )
}
