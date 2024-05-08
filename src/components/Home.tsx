import { useState } from 'react'
import Search from './Search'
import Videos from './Videos'

export default function Home() {
  const [streamer, setStreamer] = useState<string>('')

  return (
    <div className='flex flex-col place-items-center'>
      <Search setStreamer={setStreamer} />
      {streamer && <Videos streamer={streamer} />}
    </div>
  )
}
