import type { APIRoute } from 'astro'
import { db, VideoProgress, desc } from 'astro:db'
import { getSession } from 'auth-astro/server'

export const GET: APIRoute = async ({ request }) => {
  const session = await getSession(request)

  if (!session || session?.user?.email == null) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const result = await db
      .select()
      .from(VideoProgress)
      .orderBy(desc(VideoProgress.createdAt))
      .limit(6)
    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}
