import { column, defineDb } from 'astro:db'

const VideoProgress = {
  columns: {
    id: column.text({ primaryKey: true }), // userId-videoId
    videoId: column.text(),
    userId: column.text(),
    progress: column.number(),
  },
}
// https://astro.build/db/config
export default defineDb({
  tables: {
    VideoProgress,
  },
})
