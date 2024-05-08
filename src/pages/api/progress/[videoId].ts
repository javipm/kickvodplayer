import type { APIRoute } from 'astro'
import { db, VideoProgress } from 'astro:db'
import { object, number, safeParse } from 'valibot'
import { getSession } from 'auth-astro/server'
import { createHash } from 'node:crypto'

const VideoProgressSchema = object({
  progress: number(),
})

const generateUserId = (str: string) => {
  return createHash('sha256').update(str).digest('hex')
}

export const POST: APIRoute = async ({ params, request }) => {
  const session = await getSession(request)

  if (!session || session?.user?.email == null) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = generateUserId(session.user.email)
  const { videoId } = params
  if (!videoId) {
    return new Response('Missing videoId', { status: 400 })
  }

  const { success, output } = safeParse(
    VideoProgressSchema,
    await request.json()
  )

  if (!success) {
    return new Response('Bad request', { status: 400 })
  }

  const { progress } = output

  const newId = `${userId}-${videoId}`
  const data = {
    id: newId,
    userId,
    videoId,
    progress: progress,
  }

  console.log(data)
  try {
    await db
      .insert(VideoProgress)
      .values(data)
      .onConflictDoUpdate({
        target: VideoProgress.id,
        set: {
          progress: data.progress,
        },
      })
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}
