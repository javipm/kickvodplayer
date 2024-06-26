import { column, defineDb } from 'astro:db'

const VideoProgress = {
  columns: {
    id: column.text({ primaryKey: true }), // userId-videoId
    videoId: column.text(),
    userId: column.text(),
    progress: column.number(),
    createdAt: column.date(),
  },
}

const Follow = {
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text(),
    streamer: column.text(),
    createdAt: column.date(),
  },
}

// https://astro.build/db/config
export default defineDb({
  tables: {
    VideoProgress,
    Follow,
  },
})
