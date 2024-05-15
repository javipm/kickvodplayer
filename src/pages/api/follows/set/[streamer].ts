import type { APIRoute } from 'astro'
import { db, NOW, Follow } from 'astro:db'
import { getSession } from 'auth-astro/server'
import { generateUserId } from '@/lib/utils'

export const GET: APIRoute = async ({ params, request }) => {
  const session = await getSession(request)

  if (!session || session?.user?.email == null) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = await generateUserId(session.user.email)

  const { streamer } = params
  if (!streamer) {
    return new Response('Missing streamer', { status: 400 })
  }

  const newId = `${userId}-${streamer}`
  const data = {
    id: newId,
    userId,
    streamer,
    createdAt: NOW,
  }

  try {
    await db.insert(Follow).values(data).onConflictDoNothing({
      target: Follow.id,
    })
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}
