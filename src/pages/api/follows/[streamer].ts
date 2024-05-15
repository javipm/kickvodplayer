import type { APIRoute } from 'astro'
import { and, db, eq, Follow } from 'astro:db'
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

  try {
    const result = await db
      .select()
      .from(Follow)
      .where(and(eq(Follow.userId, userId), eq(Follow.streamer, streamer)))
      .limit(1)

    let response = ''
    if (result.length > 0) {
      response = JSON.stringify({
        isFollowing: true,
        data: result[0],
      })
    } else {
      response = JSON.stringify({
        isFollowing: false,
      })
    }

    return new Response(response, { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}
