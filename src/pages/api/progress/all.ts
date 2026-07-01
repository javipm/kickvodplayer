import type { APIRoute } from 'astro'
import { getUser, createSupabaseServerClient } from '@/lib/supabase'

export const GET: APIRoute = async ({ request, cookies }) => {
  const user = await getUser(request, cookies)

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const params = new URL(request.url).searchParams
  const limit = params.get('limit') || null

  const supabase = createSupabaseServerClient(request, cookies)

  try {
    let query = supabase
      .from('video_progress')
      .select('videoId:video_id, progress, createdAt:created_at')
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data, error } = await query
    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}
