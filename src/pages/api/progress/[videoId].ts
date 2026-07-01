import type { APIRoute } from 'astro'
import { object, number, safeParse } from 'valibot'
import { getUser, createSupabaseServerClient } from '@/lib/supabase'

const VideoProgressSchema = object({
  progress: number(),
})

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const user = await getUser(request, cookies)

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { videoId } = params
  if (!videoId) {
    return new Response('Missing videoId', { status: 400 })
  }

  const result = safeParse(VideoProgressSchema, await request.json())

  if (!result.success) {
    return new Response('Bad request', { status: 400 })
  }

  const { progress } = result.output

  const supabase = createSupabaseServerClient(request, cookies)

  try {
    await supabase
      .from('video_progress')
      .upsert(
        { user_id: user.id, video_id: videoId, progress },
        { onConflict: 'user_id,video_id' }
      )
      .throwOnError()
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}
