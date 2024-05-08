import { useState } from 'react'

export default function Search({
  setStreamer,
}: {
  setStreamer: (search: string) => void
}) {
  return (
    <input
      type='text'
      placeholder='Type Kick streamer name to get VOD videos'
      className='w-1/2 p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 mt-10 text-black'
      onChange={(event) => setStreamer(event.target.value)}
    />
  )
}
