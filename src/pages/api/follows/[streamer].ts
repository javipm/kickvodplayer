import type { APIRoute } from 'astro'
import { getUser, createSupabaseServerClient } from '@/lib/supabase'

export const GET: APIRoute = async ({ params, request, cookies }) => {
  const user = await getUser(request, cookies)

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { streamer } = params
  if (!streamer) {
    return new Response('Missing streamer', { status: 400 })
  }

  const supabase = createSupabaseServerClient(request, cookies)

  try {
    const { data, error } = await supabase
      .from('follow')
      .select()
      .eq('streamer', streamer)
      .limit(1)

    if (error) throw error

    let response = ''
    if (data.length > 0) {
      response = JSON.stringify({
        isFollowing: true,
        data: data[0],
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
