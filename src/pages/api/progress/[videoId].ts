import type { APIRoute } from 'astro'
import { db, NOW, VideoProgress } from 'astro:db'
import { object, number, safeParse } from 'valibot'
import { getSession } from 'auth-astro/server'
import { generateUserId } from '@/lib/utils'

const VideoProgressSchema = object({
  progress: number(),
})

export const POST: APIRoute = async ({ params, request }) => {
  const session = await getSession(request)

  if (!session || session?.user?.email == null) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = await generateUserId(session.user.email)
  const { videoId } = params
  if (!videoId) {
    return new Response('Missing videoId', { status: 400 })
  }

  const result = safeParse(VideoProgressSchema, await request.json())

  if (!result.success) {
    return new Response('Bad request', { status: 400 })
  }

  const { progress } = result.output

  const newId = `${userId}-${videoId}`
  const data = {
    id: newId,
    userId,
    videoId,
    progress: progress,
    createdAt: NOW,
  }

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
